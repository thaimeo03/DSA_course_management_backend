import Stripe from 'stripe'
import { Course } from 'database/entities/course.entity'
import { User } from 'database/entities/user.entity'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Payment } from 'database/entities/payment.entity'
import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Coupon } from 'database/entities/coupon.entity'

@Injectable()
export class StripeService {
    private stripe: Stripe

    constructor(
        private configService: ConfigService,
        @InjectRepository(Payment) private paymentRepository: Repository<Payment>
    ) {
        this.setSecretKey()
    }

    async checkout(user: User, course: Course, payment: Payment, coupon?: Coupon): Promise<string> {
        const product = await this.createProduct(course)
        const price = await this.createPrice(product, payment.totalPrice)
        const stripeCoupon = coupon ? await this.createCoupon(coupon) : null // This coupon is different from coupon in DB (only for Stripe handling)

        const session = await this.stripe.checkout.sessions.create({
            mode: 'payment',
            customer_email: user.email,
            line_items: [
                {
                    price: price.id,
                    quantity: 1 // Hardcode quantity (Need change later)
                }
            ],
            discounts: [
                {
                    coupon: stripeCoupon?.id
                }
            ],
            success_url: `${this.configService.get('HOST')}/payments/callback?success=1&paymentId=${payment.id}`, // Hardcode
            cancel_url: `${this.configService.get('HOST')}/payments/callback?success=0&paymentId=${payment.id}` // Hardcode
        })

        await this.paymentRepository.update(payment.id, { sessionId: session.id })

        return session.url
    }

    // 1. Find product by courseId
    // 2. Create product by courseId if not exist
    async createProduct(course: Course): Promise<Stripe.Product> {
        // 1
        const product = await this.stripe.products.retrieve(course.id)
        if (product) return product

        // 2
        return this.stripe.products.create({
            id: course.id,
            name: course.title,
            images: [course.thumbnail]
        })
    }

    // 1. Find price by productId and active = true
    // 2. Create price by productId if not exist
    async createPrice(product: Stripe.Product, unitAmount: number): Promise<Stripe.Price> {
        // 1
        const prices = await this.stripe.prices.search({
            query: "active:'true' AND product:'" + product.id + "'"
        })
        if (prices.total_count > 0) return prices.data[0]

        // 2
        return this.stripe.prices.create({
            currency: 'vnd', // Hardcode currency (Need change later)
            product: product.id,
            unit_amount: unitAmount
        })
    }

    // 1. Find coupon by code
    // 2. Create coupon by code if not exist
    async createCoupon(coupon: Coupon): Promise<Stripe.Coupon> {
        const couponExist = await this.stripe.coupons.retrieve(coupon.code)
        if (couponExist) return couponExist

        return this.stripe.coupons.create({
            id: coupon.code,
            amount_off: coupon.amountOff,
            percent_off: coupon.percentOff,
            currency: 'vnd', // Hardcode currency (Need change later),
            max_redemptions: coupon.maxRedeem,
            redeem_by: coupon.expiredAt.getTime()
        })
    }

    setSecretKey() {
        this.stripe = new Stripe(
            'sk_test_51QFpLNJoIUxSdq28D8N3UPOBEXuFmWhLBkKBJU4Z71Vl328R1mL4hgLn3VO7cDVTpDPufIFT8HDyzw4yyocY1Ywk00csHipoAZ'
        ) // Hardcode secret key (Need change later)
    }
}
