import { Module } from '@nestjs/common'
import { CouponsController } from './coupons.controller'
import { CouponsService } from './coupons.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Coupon } from 'database/entities/coupon.entity'

@Module({
    imports: [TypeOrmModule.forFeature([Coupon])],
    controllers: [CouponsController],
    providers: [CouponsService],
    exports: [CouponsService]
})
export class CouponsModule {}
