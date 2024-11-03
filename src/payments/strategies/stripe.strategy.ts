import Stripe from 'stripe'
import { IPaymentStrategy } from '../interfaces/payment-strategy.interface'
import { Course } from 'database/entities/course.entity'
import { User } from 'database/entities/user.entity'
import { PayOptionsDto } from '../dto/pay-options.dto'

export class StripeStrategy implements IPaymentStrategy {
    private stripe: Stripe

    constructor() {
        this.stripe = new Stripe(
            'sk_test_51QFpLNJoIUxSdq28D8N3UPOBEXuFmWhLBkKBJU4Z71Vl328R1mL4hgLn3VO7cDVTpDPufIFT8HDyzw4yyocY1Ywk00csHipoAZ'
        )
    }

    async pay(
        user: User,
        course: Course,
        unitAmount: number,
        options?: PayOptionsDto
    ): Promise<string> {
        return 'Payment done with Stripe'
    }

    async createProduct(course: Course): Promise<Stripe.Product> {
        return this.stripe.products.create({
            name: course.title,
            images: [course.thumbnail]
        })
    }

    async createPrice(course: Stripe.Product, unitAmount: number): Promise<Stripe.Price> {
        return this.stripe.prices.create({
            currency: 'vnd', // Hardcode currency (Need change later)
            unit_amount: unitAmount
        })
    }
}
