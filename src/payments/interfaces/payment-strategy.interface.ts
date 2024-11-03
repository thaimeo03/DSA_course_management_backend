import { Course } from 'database/entities/course.entity'
import { User } from 'database/entities/user.entity'
import { Payment } from 'database/entities/payment.entity'

export interface IPaymentStrategy {
    pay(user: User, course: Course, payment: Payment): Promise<string>
}
