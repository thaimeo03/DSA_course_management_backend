import { Injectable } from '@nestjs/common'
import { StripeService } from './stripe.service'
import { Course } from 'database/entities/course.entity'

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
}
