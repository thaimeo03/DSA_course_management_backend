import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Payment } from 'database/entities/payment.entity'
import { Not, Repository } from 'typeorm'
import { PaymentFactory } from './payment.factory'
import { PayDto } from './dto/pay.dto'
import { User } from 'database/entities/user.entity'
import { Course } from 'database/entities/course.entity'
import { UserMessages } from 'common/constants/messages/user.message'
import { CourseMessages } from 'common/constants/messages/course.message'
import { PaymentStatus } from 'common/enums/payment.enum'
import { PaymentMessages } from 'common/constants/messages/payment.message'
import { Coupon } from 'database/entities/coupon.entity'
import { CallbackDto } from './dto/callback.dto'
import { CreatePaymentDto } from './dto/create-payment.dto'

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Course) private courseRepository: Repository<Course>,
        @InjectRepository(Coupon) private couponRepository: Repository<Coupon>,
        private paymentsFactory: PaymentFactory
    ) {}

    // 1. Create new payment into database
    // 2. Get payment strategy
    // 3. Pay
    async processPayment(userId: string, payDto: PayDto) {
        const { courseId, method, code } = payDto

        const user = await this.userRepository.findOneBy({ id: userId })
        if (!user) throw new NotFoundException(UserMessages.USER_NOT_FOUND)

        const course = await this.courseRepository.findOneBy({ id: courseId })
        if (!course) throw new NotFoundException(CourseMessages.COURSE_NOT_FOUND)

        // Handle create payment here
        const payment = await this.createPayment({ user, course, method })

        // 2
        const paymentStrategy = await this.paymentsFactory.getPaymentStrategy(method)

        // 3
        const coupon = code
            ? await this.couponRepository.findOneBy({
                  code,
                  user: {
                      id: user.id
                  }
              })
            : null

        return paymentStrategy.pay(user, course, payment, coupon) // Hardcode unitAmount (need change later after apply discount)
    }

    // 1. Check course been paid
    // 2. Create payment
    async createPayment(createPaymentDto: CreatePaymentDto) {
        const { user, course, method } = createPaymentDto
        // 1
        const payment = await this.paymentRepository.findOneBy({
            user,
            course,
            status: PaymentStatus.Completed
        })
        if (payment) throw new NotFoundException(PaymentMessages.COURSE_BEEN_PAID)

        // 2
        return this.paymentRepository.save({
            user,
            course,
            method,
            totalPrice: course.price
        })
    }

    // 1. Update payment status
    // 2. Throw error if payment failed
    // 3. Handle send email
    async callbackPayment(callbackDto: CallbackDto) {
        const { paymentId, success } = callbackDto

        await this.paymentRepository.update(paymentId, {
            status: success === 1 ? PaymentStatus.Completed : PaymentStatus.Failed
        })

        // 2
        if (success === 0) return false

        // 3
        // Handle send email here in future
        return true
    }
}
