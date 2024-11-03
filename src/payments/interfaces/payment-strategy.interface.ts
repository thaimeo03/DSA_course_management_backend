import { Course } from 'database/entities/course.entity'
import { User } from 'database/entities/user.entity'
import { PayOptionsDto } from '../dto/pay-options.dto'

export interface IPaymentStrategy {
    pay(user: User, course: Course, unitAmount: number, options?: PayOptionsDto): Promise<string>
}
