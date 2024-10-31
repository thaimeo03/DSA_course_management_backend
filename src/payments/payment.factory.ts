import { Injectable, NotFoundException, Type } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { PaymentMethod } from 'common/enums/payment.enum'
import { IPaymentStrategy } from './interfaces/payment-strategy.interface'
import { StripeStrategy } from './strategies/stripe.strategy'
import { PaymentMessages } from 'common/constants/messages/payment.message'

// Factory design pattern
@Injectable()
export class PaymentFactory {
    constructor(private moduleRef: ModuleRef) {}

    // Add more payment strategies here
    private paymentStrategies = new Map<PaymentMethod, Type<IPaymentStrategy>>([
        [PaymentMethod.Stripe, StripeStrategy]
    ])

    async getPaymentStrategy(method: PaymentMethod): Promise<IPaymentStrategy> {
        const paymentStrategy = this.paymentStrategies.get(method)
        if (!paymentStrategy) throw new NotFoundException(PaymentMessages.PAYMENT_METHOD_NOT_FOUND)

        return await this.moduleRef.create(paymentStrategy) // Create a new instance and using moduleRef for performance
    }
}
