import Stripe from 'stripe'
import { Course } from 'database/entities/course.entity'
import { User } from 'database/entities/user.entity'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Payment } from 'database/entities/payment.entity'
import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Coupon } from 'database/entities/coupon.entity'
import { getPaymentCallbackRoute } from './helpers/get-payment-callback-route.helper'

@Injectable()
export class StripeService {
    private stripe: Stripe

    constructor(
        private configService: ConfigService,
        @InjectRepository(Payment) private paymentRepository: Repository<Payment>
    ) {
        this.setSecretKey()
    }

    // https://docs.stripe.com/products-prices/how-products-and-prices-work
    // https://docs.stripe.com/api
    // 1. Create stripe product
    // 2. Create stripe price
    // 3. Create stripe coupon
    // 4. Create checkout session
    // 5. Update payment and return session url
    async checkout(user: User, course: Course, payment: Payment, coupon?: Coupon): Promise<string> {
        // 1
        const product = await this.createProduct(course)

        // 2
        const price = await this.createPrice(product, payment.totalPrice)

        // 3
        const stripeCoupon = coupon !== null ? await this.createCoupon(coupon) : null // This coupon is different from coupon in DB (only for Stripe handling)

        // 4
        const session = await this.stripe.checkout.sessions.create({
            mode: 'payment',
            customer_email: user.email,
            line_items: [
                {
                    price: price.id,
                    quantity: 1 // Only one course and one time
                }
            ],
            discounts: [
                {
                    coupon: stripeCoupon?.id
                }
            ],
            success_url: getPaymentCallbackRoute(this.configService.get('HOST'), 1, payment.id),
            cancel_url: getPaymentCallbackRoute(this.configService.get('HOST'), 0, payment.id)
        })

        // 5
        await this.paymentRepository.update(payment.id, {
            sessionId: session.id,
            totalPrice: session.amount_total
        })

        return session.url
    }

    // 1. Find product by courseId
    // 2. Create product by courseId if not exist
    async createProduct(course: Course): Promise<Stripe.Product> {
        // 1
        try {
            const product = await this.stripe.products.retrieve(course.id)
            if (product) return product
        } catch (error) {}

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
        try {
            const couponExist = await this.stripe.coupons.retrieve(coupon.code)
            if (couponExist) return couponExist
        } catch (error) {}

        const params: Stripe.CouponCreateParams = {
            id: coupon.code,
            duration: 'once',
            currency: 'vnd'
        }

        if (coupon.amountOff) params['amount_off'] = coupon.amountOff
        if (coupon.percentOff) params['percent_off'] = coupon.percentOff
        if (coupon.maxRedeem) params['max_redemptions'] = coupon.maxRedeem
        if (coupon.expiredAt) params['redeem_by'] = coupon.expiredAt.getTime()

        return this.stripe.coupons.create(params)
    }

    setSecretKey() {
        this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'))
    }
}
