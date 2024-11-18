import { BadRequestException, Injectable } from '@nestjs/common'
import { PaymentFactory } from './payment.factory'
import { PayDto } from './dto/pay.dto'
import { PaymentStatus } from 'common/enums/payment.enum'
import { PaymentMessages } from 'common/constants/messages/payment.message'
import { CallbackDto } from './dto/callback.dto'
import { CreatePaymentDto } from './dto/create-payment.dto'
import { PaymentRepository } from 'src/repositories/payment.repository'
import { UserRepository } from 'src/repositories/user.repository'
import { CourseRepository } from 'src/repositories/course.repository'
import { CouponRepository } from 'src/repositories/coupon.repository'
import { CourseMessages } from 'common/constants/messages/course.message'

@Injectable()
export class PaymentsService {
    constructor(
        private paymentRepository: PaymentRepository,
        private userRepository: UserRepository,
        private courseRepository: CourseRepository,
        private couponRepository: CouponRepository,
        private paymentsFactory: PaymentFactory
    ) {}

    // 1. Check user and course exists
    // 2. Create simple payment
    // 3. Get coupon by user, code
    // 4. Apply payment factory
    async processPayment(userId: string, payDto: PayDto) {
        const { courseId, method, code } = payDto
        // 1
        const user = await this.userRepository.checkUserExists({ id: userId })

        const course = await this.courseRepository.checkCourseExists({ id: courseId })
        if (!course.isActive) throw new BadRequestException(CourseMessages.COURSE_NOT_ACTIVE)

        // 2
        const payment = await this.createPayment({ user, course, method })

        // 3
        const coupon = code
            ? await this.couponRepository.findOneBy({
                  code,
                  user: {
                      id: user.id
                  }
              })
            : null

        // 4
        const paymentStrategy = await this.paymentsFactory.getPaymentStrategy(method)
        return paymentStrategy.processPayment(user, course, payment, coupon)
    }

    // 1. Check course been paid
    // 2. Create payment
    async createPayment(createPaymentDto: CreatePaymentDto) {
        const { user, course, method } = createPaymentDto
        // 1
        const payment = await this.paymentRepository.findOneBy({
            user: {
                id: user.id
            },
            course: {
                id: course.id
            },
            status: PaymentStatus.Completed
        })
        if (payment) throw new BadRequestException(PaymentMessages.COURSE_BEEN_PAID)

        // 2
        return this.paymentRepository.save({
            user,
            course,
            method,
            totalPrice: course.price
        })
    }

    // 1. Update payment status
    // 2. Handle send email if success
    async callbackPayment(callbackDto: CallbackDto) {
        const { paymentId, success } = callbackDto

        // 1
        await this.paymentRepository.update(paymentId, {
            status: success === 1 ? PaymentStatus.Completed : PaymentStatus.Failed
        })

        // 2
        if (success === 0) return false

        // Handle send email here in future
        //

        return true
    }
}
