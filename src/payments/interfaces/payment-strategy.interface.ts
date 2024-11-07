import { Course } from 'database/entities/course.entity'
import { User } from 'database/entities/user.entity'
import { Payment } from 'database/entities/payment.entity'
import { Coupon } from 'database/entities/coupon.entity'

export interface IPaymentStrategy {
    processPayment(user: User, course: Course, payment: Payment, coupon?: Coupon): Promise<string> // String here is payment's host-page URL that will be redirected to
}
