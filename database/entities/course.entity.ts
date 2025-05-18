import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'
import { Lesson } from './lesson.entity'
import { Problem } from './problem.entity'
import { Payment } from './payment.entity'

@Entity('Courses')
export class Course {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 200 })
    title: string

    @Column({ type: 'varchar', nullable: true })
    videoUrl: string

    @Column({ type: 'text', nullable: true })
    description: string

    @Column({ type: 'varchar' })
    thumbnail: string

    @Column({ type: 'real' })
    price: number

    @Column({ type: 'boolean', default: false })
    isActive: boolean

    @Column({ type: 'boolean', default: false })
    isArchived: boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(() => Lesson, (lesson) => lesson.course, { cascade: true })
    lessons: Lesson[]

    @OneToMany(() => Problem, (problem) => problem.course, { cascade: true })
    problems: Problem[]

    @OneToMany(() => Payment, (payment) => payment.course)
    payments: Payment[]
}
