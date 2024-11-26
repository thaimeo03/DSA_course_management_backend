import { Module } from '@nestjs/common'
import { CouponsController } from './coupons.controller'
import { CouponsService } from './coupons.service'
import { Coupon } from 'database/entities/coupon.entity'
import { RepositoriesModule } from 'src/repositories/repositories.module'
import { CouponRepository } from 'src/repositories/coupon.repository'
import { PaymentsModule } from 'src/payments/payments.module'
import { User } from 'database/entities/user.entity'
import { UserRepository } from 'src/repositories/user.repository'

@Module({
    imports: [
        RepositoriesModule.register([Coupon, User], [CouponRepository, UserRepository]),
        PaymentsModule
    ],
    controllers: [CouponsController],
    providers: [CouponsService]
})
export class CouponsModule {}
