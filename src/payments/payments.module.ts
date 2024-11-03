import { Module } from '@nestjs/common'
import { PaymentsController } from './payments.controller'
import { PaymentsService } from './payments.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Payment } from 'database/entities/payment.entity'
import { PaymentFactory } from './payment.factory'
import { User } from 'database/entities/user.entity'
import { Course } from 'database/entities/course.entity'

@Module({
    imports: [TypeOrmModule.forFeature([Payment, User, Course])],
    controllers: [PaymentsController],
    providers: [PaymentsService, PaymentFactory]
})
export class PaymentsModule {}
