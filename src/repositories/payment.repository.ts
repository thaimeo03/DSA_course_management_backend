import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaymentMessages } from 'common/constants/messages/payment.message'
import { PaymentStatus } from 'common/enums/payment.enum'
import { Payment } from 'database/entities/payment.entity'
import { Repository } from 'typeorm'

@Injectable()
export class PaymentRepository extends Repository<Payment> {
    constructor(@InjectRepository(Payment) private paymentRepository: Repository<Payment>) {
        super(paymentRepository.target, paymentRepository.manager, paymentRepository.queryRunner)
    }

    /**
     * Find a payment by id and status is completed
     * @param id The id of the payment
     * @returns The payment with the given id and status is completed
     * @throws NotFoundException If the payment is not found
     */
    async findPaymentSuccessById(id: string): Promise<Payment> {
        // Find payment
        const payment = await this.paymentRepository.findOne({
            where: {
                id,
                status: PaymentStatus.Completed
            },
            relations: {
                course: true,
                user: true
            }
        })

        if (!payment) throw new NotFoundException(PaymentMessages.PAYMENT_NOT_FOUND)

        return payment
    }
}
