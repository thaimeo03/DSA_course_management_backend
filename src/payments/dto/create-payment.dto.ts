import { PaymentMethod } from 'common/enums/payment.enum'
import { Course } from 'database/entities/course.entity'
import { User } from 'database/entities/user.entity'

export class CreatePaymentDto {
    user: User
    course: Course
    method: PaymentMethod
}
