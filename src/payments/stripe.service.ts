import Stripe from 'stripe'
import { Course } from 'database/entities/course.entity'
import { User } from 'database/entities/user.entity'
import { ConfigService } from '@nestjs/config'
import { Payment } from 'database/entities/payment.entity'
import { Injectable, Logger } from '@nestjs/common'
import { Coupon } from 'database/entities/coupon.entity'
import { getPaymentCallbackRoute } from './helpers/get-payment-callback-route.helper'
import { PaymentRepository } from 'src/repositories/payment.repository'

@Injectable()
export class StripeService {
    private stripe: Stripe
    private readonly logger = new Logger(StripeService.name)

    constructor(
        private configService: ConfigService,
        private paymentRepository: PaymentRepository
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
        const price = await this.createPrice(product, course.price)

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

        this.logger.log(`Payment session created by user ${user.id} for course ${course.id}`)

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
        const product = await this.stripe.products.create({
            id: course.id,
            name: course.title,
            images: [course.thumbnail]
        })

        this.logger.log(`Product created for course ${course.id}`)

        return product
    }

    async updateProduct(course: Course): Promise<Stripe.Product> {
        const product = await this.createProduct(course)
        if (product.name === course.title && product.images[0] === course.thumbnail) return product

        const updatedProduct = await this.stripe.products.update(course.id, {
            name: course.title,
            images: [course.thumbnail]
        })

        this.logger.log(`Product updated for course ${course.id}`)

        return updatedProduct
    }

    async updateProductAndPrice(course: Course): Promise<void> {
        const updatedProduct = await this.updateProduct(course)
        await this.updatePrice(updatedProduct, course.price)
    }

    // 1. Find price by productId and active = true
    // 2. Create price by productId if not exist
    async createPrice(product: Stripe.Product, unitAmount: number): Promise<Stripe.Price> {
        // 1
        const prices = await this.stripe.prices.search({
            query: "active:'true' AND product:'" + product.id + "'"
        })
        if (prices.data.length > 0) return prices.data[0]

        // 2
        const price = await this.stripe.prices.create({
            currency: 'vnd', // Hardcode currency (Need change later)
            product: product.id,
            unit_amount: unitAmount
        })

        this.logger.log(`Price created for product ${product.id}`)

        return price
    }

    // 1. Find price by productId and check unitAmount changed
    // 2. Create new price if unitAmount changed
    async updatePrice(product: Stripe.Product, unitAmount: number): Promise<Stripe.Price> {
        // 1
        const price = await this.createPrice(product, unitAmount)
        if (price.unit_amount === unitAmount) return price

        // Old price
        await this.stripe.prices.update(price.id, { active: false })

        // 2
        const newPrice = await this.stripe.prices.create({
            currency: 'vnd', // Hardcode currency (Need change later)
            product: product.id,
            unit_amount: unitAmount
        })

        this.logger.log(`Price updated for product ${product.id}`)

        return newPrice
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

        const newCoupon = await this.stripe.coupons.create(params)

        this.logger.log(`Coupon created for coupon ${coupon.code}`)

        return newCoupon
    }

    /**
     * Deletes a coupon by its code.
     * @param code - The code of the coupon to be deleted.
     * @returns - A promise that resolves when the coupon is deleted.
     */
    async deleteCoupon(code: string): Promise<void> {
        try {
            await this.stripe.coupons.del(code)
            this.logger.log(`Coupon ${code} deleted`)
        } catch (error) {
            // Handle the error
            this.logger.warn(error)
        }
    }

    /**
     * Updates a coupon by its code.
     * @param coupon - The coupon object that contains the updated data.
     * @returns - A promise that resolves when the coupon is updated.
     * @note - Following the Stripe doc, we can only update the meta data of the coupon.
     * So we need to delete the old one and create a new one. This is done by calling the
     * deleteCoupon and createCoupon methods respectively.
     */
    async updateCoupon(coupon: Coupon) {
        // Delete the old coupon
        await this.deleteCoupon(coupon.code)

        // Create a new coupon with the updated data
        await this.createCoupon(coupon)

        this.logger.log(`Coupon ${coupon.code} updated`)
    }

    setSecretKey() {
        this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'))
    }
}
