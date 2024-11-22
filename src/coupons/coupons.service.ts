import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateCouponDto } from './dto/create-coupon.dto'
import { CouponMessages } from 'common/constants/messages/coupon.message'
import { CouponType } from 'common/enums/coupons.enum'
import { CouponRepository } from 'src/repositories/coupon.repository'
import { PaymentFacade } from 'src/payments/payment.facade'
import { UpdateCouponDto } from './dto/update-coupon.dto'

@Injectable()
export class CouponsService {
    constructor(
        private couponRepository: CouponRepository,
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
        return this.couponRepository.save({
            ...createCouponDto
        })
    }

    /**
     * Deletes a coupon by its code.
     * @param code - The code of the coupon to be deleted.
     */
    async deleteCoupon(code: string) {
        // Check if the coupon exists
        const coupon = await this.couponRepository.checkCouponExists({ code })

        // Delete the coupon in the database
        await this.couponRepository.delete(coupon.id)

        // Delegate to payment facade to handle any additional deletion logic
        await this.paymentFacade.deleteCoupon(code)
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
}
