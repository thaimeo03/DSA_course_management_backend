import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Payment } from 'database/entities/payment.entity'
import { Repository } from 'typeorm'
import { PaymentFactory } from './payment.factory'
import { PayDto } from './dto/pay.dto'

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
        private paymentsFactory: PaymentFactory
    ) {}

    // 1. Create new payment into database
    // 2. Get payment strategy
    // 3. Pay
    async processPayment(userId: string, payDto: PayDto) {
        const { courseId, method } = payDto
        // 1
        // Handle create payment here

        // 2
        const paymentStrategy = await this.paymentsFactory.getPaymentStrategy(method)

        // 3
        return paymentStrategy.pay(userId, courseId)
    }
}
