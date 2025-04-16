import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { CreateCouponDto } from './dto/create-coupon.dto'
import { CouponMessages } from 'common/constants/messages/coupon.message'
import { CouponType } from 'common/enums/coupons.enum'
import { CouponRepository } from 'src/repositories/coupon.repository'
import { PaymentFacade } from 'src/payments/payment.facade'
import { UpdateCouponDto } from './dto/update-coupon.dto'
import { UserRepository } from 'src/repositories/user.repository'
import { ApplyCouponDto } from './dto/apply-coupon.dto'
import { GetAllCouponsDto } from './dto/get-all-coupons.dto'

@Injectable()
export class CouponsService {
    private readonly logger = new Logger(CouponsService.name)

    constructor(
        private couponRepository: CouponRepository,
        private userRepository: UserRepository,
        private paymentFacade: PaymentFacade
    ) {}

    // 1. Check coupon code exists
    // 2. Check amount, percent
    // 3. Create coupon
    async createCoupon(createCouponDto: CreateCouponDto) {
        const { type, amountOff, percentOff } = createCouponDto
        // 1
        const coupon = await this.couponRepository.findOneBy({ code: createCouponDto.code })
        if (coupon) throw new BadRequestException(CouponMessages.COUPON_ALREADY_EXISTS)

        // 2
        if (type === CouponType.AmountOff) {
            if (!amountOff) throw new BadRequestException(CouponMessages.AMOUNT_OFF_IS_REQUIRED)
            if (percentOff)
                throw new BadRequestException(
                    CouponMessages.CAN_NOT_SET_PERCENT_OFF_WITH_AMOUNT_OFF
                )
        }
        if (type === CouponType.PercentOff) {
            if (!percentOff) throw new BadRequestException(CouponMessages.PERCENT_OFF_IS_REQUIRED)
            if (amountOff)
                throw new BadRequestException(
                    CouponMessages.CAN_NOT_SET_AMOUNT_OFF_WITH_PERCENT_OFF
                )
        }

        // 3
        const newCoupon = await this.couponRepository.save({
            ...createCouponDto
        })

        await this.paymentFacade.createCoupon(newCoupon)

        return newCoupon
    }

    /**
     * Deletes a coupon by its code.
     * @param id - The id of the coupon to be deleted.
     */
    async deleteCoupon(id: string) {
        // Check if the coupon exists
        const coupon = await this.couponRepository.checkCouponExists({ id })

        // Delete the coupon in the database
        await this.couponRepository.delete(coupon.id)

        // Delegate to payment facade to handle any additional deletion logic
        await this.paymentFacade.deleteCoupon(coupon.code)
    }

    /**
     * Updates a coupon by its id.
     * @param id - The id of the coupon to be updated.
     * @param updateCouponDto - The updated data of the coupon.
     * @returns - A promise that resolves when the coupon is updated.
     */
    async updateCoupon(id: string, updateCouponDto: UpdateCouponDto) {
        // Check if the coupon exists
        const coupon = await this.couponRepository.checkCouponExists({ id })

        // Update the coupon in the database
        await this.couponRepository.update(id, updateCouponDto)

        // Delegate to payment facade to handle any additional update logic
        await this.paymentFacade.updateCoupon(coupon)
    }

    /**
     * Applies a coupon to a user.
     * @param applyCouponDto - The code of the coupon and the id of the user to apply the coupon to.
     * @throws {BadRequestException} - If the coupon does not exist or if it has already been applied to a user.
     * @throws {BadRequestException} - If the coupon has been fully redeemed.
     */
    async applyCouponForUser(applyCouponDto: ApplyCouponDto) {
        const { code, userId } = applyCouponDto

        // Check if the user exists
        await this.userRepository.checkUserExists({ id: userId })

        // Get the coupon from the database
        const coupon = await this.couponRepository.findOne({
            relations: {
                user: true
            },
            where: {
                code
            }
        })
        if (!coupon) throw new BadRequestException(CouponMessages.COUPON_NOT_FOUND)

        // Check if the coupon has already been applied to a user
        if (coupon.user) throw new BadRequestException(CouponMessages.COUPON_ALREADY_APPLIED)

        // Check if the coupon has been fully redeemed
        if (coupon.maxRedeem !== null && coupon.maxRedeem <= 0)
            throw new BadRequestException(CouponMessages.COUPON_REDEEMED)

        // Apply the coupon to the user in the database
        await this.couponRepository.update(coupon.id, { user: { id: userId } })

        // Log the action
        this.logger.log(`Coupon ${code} applied for user ${userId}`)
    }

    async getAllCoupons(getAllCouponsDto: GetAllCouponsDto) {
        return this.couponRepository.findAllCoupons(getAllCouponsDto)
    }

    async getCouponDetail(id: string) {
        return this.couponRepository.checkCouponExists({ id })
    }
}
