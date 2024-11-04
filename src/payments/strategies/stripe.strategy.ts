import { Course } from 'database/entities/course.entity'
import { User } from 'database/entities/user.entity'
import { IPaymentStrategy } from '../interfaces/payment-strategy.interface'
import { StripeService } from '../stripe.service'
import { Payment } from 'database/entities/payment.entity'
import { Coupon } from 'database/entities/coupon.entity'

export class StripeStrategy implements IPaymentStrategy {
    constructor(private stripeService: StripeService) {}

    async pay(user: User, course: Course, payment: Payment, coupon?: Coupon): Promise<string> {
        return this.stripeService.checkout(user, course, payment, coupon)
    }
}
