import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateCouponDto } from './dto/create-coupon.dto'
import { CouponMessages } from 'common/constants/messages/coupon.message'
import { CouponType } from 'common/enums/coupons.enum'
import { CouponRepository } from 'src/repositories/coupon.repository'

@Injectable()
export class CouponsService {
    constructor(private couponRepository: CouponRepository) {}

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

    async findCouponByCodeAndUserId(code: string, userId: string) {
        const coupon = await this.couponRepository.findOneBy({
            code,
            user: {
                id: userId
            }
        })

        if (!coupon) throw new BadRequestException(CouponMessages.COUPON_NOT_FOUND)

        return coupon
    }
}
