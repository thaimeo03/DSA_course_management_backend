import { Difficulty } from 'common/enums/problem.enum'
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'
import { Course } from './course.entity'
import { Template } from './template.entity'
import { Submission } from './submission.entity'

@Entity('Problems')
export class Problem {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 300 })
    title: string

    @Column({ type: 'text', nullable: true })
    content: string

    @Column({ type: 'real', default: 0 })
    point: number

    @Column({ type: 'enum', enum: Difficulty, default: Difficulty.Easy })
    difficulty: Difficulty

    @Column({ type: 'boolean', default: false })
    isActive: boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(() => Course, (course) => course.problems, { onDelete: 'CASCADE' })
    course: Course

    @OneToMany(() => Template, (template) => template.problem)
    templates: Template[]

    @OneToMany(() => Submission, (submission) => submission.problem)
    submissions: Submission[]
}
