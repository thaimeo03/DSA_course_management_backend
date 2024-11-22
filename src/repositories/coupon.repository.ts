import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CouponMessages } from 'common/constants/messages/coupon.message'
import { Coupon } from 'database/entities/coupon.entity'
import { FindOptionsWhere, Repository } from 'typeorm'

@Injectable()
export class CouponRepository extends Repository<Coupon> {
    constructor(@InjectRepository(Coupon) private couponRepository: Repository<Coupon>) {
        super(couponRepository.target, couponRepository.manager, couponRepository.queryRunner)
    }

    /**
     * Checks if a coupon exists.
     * @param where - The conditions to find the coupon.
     * @returns The coupon if it exists.
     * @throws BadRequestException - If the coupon does not exist.
     */
    async checkCouponExists(where: FindOptionsWhere<Coupon> | FindOptionsWhere<Coupon>[]) {
        const coupon = await this.couponRepository.findOneBy(where)
        if (!coupon) throw new BadRequestException(CouponMessages.COUPON_NOT_FOUND)

        return coupon
    }
}
