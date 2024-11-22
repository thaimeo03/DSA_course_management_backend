import { Injectable } from '@nestjs/common'
import { StripeService } from './stripe.service'
import { Course } from 'database/entities/course.entity'
import { Coupon } from 'database/entities/coupon.entity'

@Injectable()
export class PaymentFacade {
    constructor(private stripeService: StripeService) {}

    async updateCourse(course: Course) {
        await this.stripeService.updateProductAndPrice(course)

        // Update more here
    }

    async deleteCoupon(code: string) {
        await this.stripeService.deleteCoupon(code)

        // Delete more here
    }

    async updateCoupon(coupon: Coupon) {
        await this.stripeService.updateCoupon(coupon)

        // Update more here
    }
}
