import { Injectable, NotFoundException } from '@nestjs/common'
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

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Course) private courseRepository: Repository<Course>,
        private paymentsFactory: PaymentFactory
    ) {}

    // 1. Create new payment into database
    // 2. Get payment strategy
    // 3. Pay
    async processPayment(userId: string, payDto: PayDto) {
        const { courseId, method } = payDto

        const user = await this.userRepository.findOneBy({ id: userId })
        if (!user) throw new NotFoundException(UserMessages.USER_NOT_FOUND)

        const course = await this.courseRepository.findOneBy({ id: courseId })
        if (!course) throw new NotFoundException(CourseMessages.COURSE_NOT_FOUND)

        // Handle create payment here
        const payment = await this.createPayment(user, course)

        // Apply discount

        // 2
        const paymentStrategy = await this.paymentsFactory.getPaymentStrategy(method)

        // 3
        return paymentStrategy.pay(user, course, payment) // Hardcode unitAmount (need change later after apply discount)
    }

    // 1. Check course been paid
    // 2. Create payment
    async createPayment(user: User, course: Course) {
        // 1
        const payment = await this.paymentRepository.findOneBy({
            user,
            course,
            status: PaymentStatus.Completed
        })
        if (payment) throw new NotFoundException(PaymentMessages.COURSE_BEEN_PAID)

        // 2
        return this.paymentRepository.create({
            user,
            course
        })
    }
}
