import { PaymentMethod, PaymentStatus } from 'common/enums/payment.enum'
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'
import { User } from './user.entity'
import { Course } from './course.entity'

@Entity('Payments')
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'smallint', default: 0 })
    quantity: string

    @Column({ type: 'real', default: 0 })
    totalPrice: number

    @Column({ type: 'enum', enum: PaymentMethod, nullable: true })
    method: PaymentMethod

    @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.Pending })
    status: PaymentStatus

    @Column({ type: 'timestamp', nullable: true })
    paymentDate: Date

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @Column({ type: 'varchar', unique: true, nullable: true })
    sessionId: string

    @ManyToOne(() => User, (user) => user.payments)
    user: User

    @ManyToOne(() => Course, (course) => course.payments)
    course: Course
}
