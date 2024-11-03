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
        // Apply discount

        // 2
        const paymentStrategy = await this.paymentsFactory.getPaymentStrategy(method)

        // 3
        return paymentStrategy.pay(user, course, 100000) // Hardcode unitAmount (need change later after apply discount)
    }
}
