import { Module } from '@nestjs/common'
import { PaymentsController } from './payments.controller'
import { PaymentsService } from './payments.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Payment } from 'database/entities/payment.entity'
import { PaymentFactory } from './payment.factory'
import { User } from 'database/entities/user.entity'
import { Course } from 'database/entities/course.entity'
import { StripeService } from './stripe.service'
import { Coupon } from 'database/entities/coupon.entity'

@Module({
    imports: [TypeOrmModule.forFeature([Payment, User, Course, Coupon])],
    controllers: [PaymentsController],
    providers: [PaymentsService, PaymentFactory, StripeService]
})
export class PaymentsModule {}
