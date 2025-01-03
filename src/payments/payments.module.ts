import { Module } from '@nestjs/common'
import { PaymentsController } from './payments.controller'
import { PaymentsService } from './payments.service'
import { Payment } from 'database/entities/payment.entity'
import { PaymentFactory } from './payment.factory'
import { User } from 'database/entities/user.entity'
import { Course } from 'database/entities/course.entity'
import { StripeService } from './stripe.service'
import { Coupon } from 'database/entities/coupon.entity'
import { RepositoriesModule } from 'src/repositories/repositories.module'
import { PaymentRepository } from 'src/repositories/payment.repository'
import { UserRepository } from 'src/repositories/user.repository'
import { CourseRepository } from 'src/repositories/course.repository'
import { CouponRepository } from 'src/repositories/coupon.repository'
import { PaymentFacade } from './payment.facade'
import { MailsModule } from 'src/mails/mails.module'

@Module({
    imports: [
        RepositoriesModule.register(
            [Payment, User, Course, Coupon],
            [PaymentRepository, UserRepository, CourseRepository, CouponRepository]
        ),
        MailsModule
    ],
    controllers: [PaymentsController],
    providers: [PaymentsService, PaymentFactory, PaymentFacade, StripeService],
    exports: [PaymentFacade]
})
export class PaymentsModule {}
