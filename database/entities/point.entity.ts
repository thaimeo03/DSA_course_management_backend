import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'
import { User } from './user.entity'

@Entity('Points')
export class Point {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'real', default: 0 })
    value: number

    @UpdateDateColumn()
    updatedAt: Date

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User
}
