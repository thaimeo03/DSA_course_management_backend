import { Module } from '@nestjs/common'
import { CouponsController } from './coupons.controller'
import { CouponsService } from './coupons.service'
import { Coupon } from 'database/entities/coupon.entity'
import { RepositoriesModule } from 'src/repositories/repositories.module'
import { CouponRepository } from 'src/repositories/coupon.repository'

@Module({
    imports: [RepositoriesModule.register([Coupon], [CouponRepository])],
    controllers: [CouponsController],
    providers: [CouponsService]
})
export class CouponsModule {}
