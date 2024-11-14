import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Coupon } from 'database/entities/coupon.entity'
import { Repository } from 'typeorm'

@Injectable()
export class CouponRepository extends Repository<Coupon> {
    constructor(@InjectRepository(Coupon) private couponRepository: Repository<Coupon>) {
        super(couponRepository.target, couponRepository.manager, couponRepository.queryRunner)
    }
}
