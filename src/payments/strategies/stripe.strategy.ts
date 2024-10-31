import { IPaymentStrategy } from '../interfaces/payment-strategy.interface'

export class StripeStrategy implements IPaymentStrategy {
    async pay(userId: string, courseId: string): Promise<string> {
        return 'Payment with Stripe'
    }
}
