import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Payment } from 'database/entities/payment.entity'
import { Repository } from 'typeorm'

@Injectable()
export class PaymentRepository extends Repository<Payment> {
    constructor(@InjectRepository(Payment) private paymentRepository: Repository<Payment>) {
        super(paymentRepository.target, paymentRepository.manager, paymentRepository.queryRunner)
    }
}
