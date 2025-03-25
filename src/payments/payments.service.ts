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
import { MailsService } from 'src/mails/mails.service'
import { FormatUtil } from 'common/utils/format.util'

@Injectable()
export class PaymentsService {
    constructor(
        private paymentRepository: PaymentRepository,
        private userRepository: UserRepository,
        private courseRepository: CourseRepository,
        private couponRepository: CouponRepository,
        private paymentsFactory: PaymentFactory,
        private mailsService: MailsService
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
        const isPurchase = await this.courseRepository.isPurchaseCourse(course.id, user.id)
        if (isPurchase) throw new BadRequestException(PaymentMessages.COURSE_BEEN_PAID)

        // 2
        return this.paymentRepository.save({
            user,
            course,
            method,
            totalPrice: course.price
        })
    }

    /**
     * Handle payment callback
     *
     * @param callbackDto callback data
     * @returns true if success, false if failed
     */
    async callbackPayment(callbackDto: CallbackDto): Promise<boolean> {
        const { paymentId, success } = callbackDto

        // Update payment status and payment date
        await this.paymentRepository.update(paymentId, {
            status: success === 1 ? PaymentStatus.Completed : PaymentStatus.Failed,
            paymentDate: new Date()
        })

        // Return false if failed
        if (success === 0) return false

        // Handle send email to announce payment success
        // Find payment info
        const payment = await this.paymentRepository.findPaymentSuccessById(paymentId)

        // Send email
        await this.mailsService.sendMailPaymentSuccess({
            courseName: payment.course.title,
            userEmail: payment.user.email,
            userName: payment.user.fullName,
            totalPrice: FormatUtil.formatMoney(payment.totalPrice),
            paymentDate: FormatUtil.formatDate(payment.paymentDate)
        })

        return true
    }

    async getSuccessOrderHistory(userId: string) {
        const payments = this.paymentRepository.find({
            relations: {
                user: true,
                course: true
            },
            where: {
                user: {
                    id: userId
                },
                status: PaymentStatus.Completed
            },
            select: {
                id: true,
                totalPrice: true,
                createdAt: true,
                paymentDate: true,
                course: {
                    id: true,
                    title: true,
                    thumbnail: true
                },
                user: {}
            }
        })

        return payments
    }
}
