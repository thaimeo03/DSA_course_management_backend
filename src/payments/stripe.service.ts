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

    /**
     * Creates a checkout session in Stripe and returns the session URL.
     * @param user - The user object.
     * @param course - The course object.
     * @param payment - The payment object.
     * @param coupon - The coupon object.
     * @returns - The session URL.
     */
    async checkout(user: User, course: Course, payment: Payment, coupon?: Coupon): Promise<string> {
        // Create stripe product
        const product = await this.createProduct(course)

        // Create stripe price
        const price = await this.createPrice(product, course.price)

        // Create stripe coupon
        const stripeCoupon = coupon !== null ? await this.createCoupon(coupon) : null // This coupon is different from coupon in DB (only for Stripe handling)

        // Create checkout session
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

        // Update payment and return session url
        await this.paymentRepository.update(payment.id, {
            sessionId: session.id,
            totalPrice: session.amount_total
        })

        this.logger.log(`Payment session created by user ${user.id} for course ${course.id}`)

        return session.url
    }

    // Product handling
    /**
     * Creates a product in Stripe and returns the product.
     * @param course - The course object.
     * @returns - The product object.
     */
    async createProduct(course: Course): Promise<Stripe.Product> {
        // Find product by courseId
        try {
            const product = await this.stripe.products.retrieve(course.id)
            if (product) return product
        } catch (error) {
            this.logger.warn(`Product not found for course ${course.id}`)
        }

        // Create product by courseId if not exist
        const product = await this.stripe.products.create({
            id: course.id,
            name: course.title,
            images: [course.thumbnail]
        })

        this.logger.log(`Product created for course ${course.id}`)

        return product
    }

    /**
     * Updates a product in Stripe and returns the updated product.
     * @param course - The course object.
     * @returns - The updated product object.
     */
    async updateProduct(course: Course): Promise<Stripe.Product> {
        // Check product
        const product = await this.createProduct(course)
        if (product.name === course.title && product.images[0] === course.thumbnail) return product

        // Update product
        const updatedProduct = await this.stripe.products.update(course.id, {
            name: course.title,
            images: [course.thumbnail]
        })

        this.logger.log(`Product updated for course ${course.id}`)

        return updatedProduct
    }

    /**
     * Updates a product and its price in Stripe.
     * @param course - The course object.
     */
    async updateProductAndPrice(course: Course): Promise<void> {
        const updatedProduct = await this.updateProduct(course)
        await this.updatePrice(updatedProduct, course.price)
    }

    // Price handling
    /**
     * Creates a price in Stripe if it doesn't exist and returns the price.
     * @param product - The Stripe product object.
     * @param unitAmount - The unit amount for the price.
     * @returns - The Stripe price object.
     */
    async createPrice(product: Stripe.Product, unitAmount: number): Promise<Stripe.Price> {
        // Find price by productId and active = true
        const prices = await this.stripe.prices.search({
            query: "active:'true' AND product:'" + product.id + "'"
        })
        if (prices.data.length > 0) return prices.data[0]

        // Create price by productId if not exist
        const price = await this.stripe.prices.create({
            currency: 'vnd', // Hardcode currency (Need change later)
            product: product.id,
            unit_amount: unitAmount
        })

        this.logger.log(`Price created for product ${product.id}`)

        return price
    }

    /**
     * Updates a price in Stripe if the unit amount has changed and returns the new price.
     * @param product - The Stripe product object.
     * @param unitAmount - The new unit amount for the price.
     * @returns - The updated Stripe price object.
     */
    async updatePrice(product: Stripe.Product, unitAmount: number): Promise<Stripe.Price> {
        // Find price by productId and check unitAmount changed
        const price = await this.createPrice(product, unitAmount)
        if (price.unit_amount === unitAmount) return price

        // Deactivate old price
        await this.stripe.prices.update(price.id, { active: false })

        // Create new price if unitAmount changed
        const newPrice = await this.stripe.prices.create({
            currency: 'vnd', // Hardcode currency (Need change later)
            product: product.id,
            unit_amount: unitAmount
        })

        this.logger.log(`Price updated for product ${product.id}`)

        return newPrice
    }

    /**
     * Creates a coupon in Stripe if it does not exist and returns the coupon.
     * @param coupon - The coupon object containing the necessary details.
     * @returns - The created or retrieved Stripe coupon object.
     */
    async createCoupon(coupon: Coupon): Promise<Stripe.Coupon> {
        try {
            const couponExist = await this.stripe.coupons.retrieve(coupon.code)
            if (couponExist) return couponExist
        } catch (error) {
            this.logger.warn(`Coupon not found for code ${coupon.code}`)
        }

        // Define coupon parameters for creation
        const params: Stripe.CouponCreateParams = {
            id: coupon.code,
            duration: 'once',
            currency: 'vnd'
        }

        // Set optional parameters if they exist
        if (coupon.amountOff) params['amount_off'] = coupon.amountOff
        if (coupon.percentOff) params['percent_off'] = coupon.percentOff
        if (coupon.maxRedeem) params['max_redemptions'] = coupon.maxRedeem
        if (coupon.expiredAt) params['redeem_by'] = coupon.expiredAt.getTime() / 1000 // Convert to seconds

        // Create the coupon in Stripe
        const newCoupon = await this.stripe.coupons.create(params)

        // Log the creation of the coupon
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
