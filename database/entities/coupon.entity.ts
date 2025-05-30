import { CouponType } from 'common/enums/coupons.enum'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { User } from './user.entity'

@Entity('Coupons')
export class Coupon {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'enum', enum: CouponType })
    type: CouponType

    @Column({ type: 'varchar', length: 100, unique: true })
    code: string

    @Column({ type: 'real', nullable: true })
    amountOff: number

    @Column({ type: 'real', nullable: true })
    percentOff: number

    @Column({ type: 'int', nullable: true })
    maxRedeem: number

    @Column({ type: 'timestamp', nullable: true })
    expiredAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(() => User, (user) => user.coupons, { nullable: true })
    user: User
}
