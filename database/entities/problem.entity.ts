import { Difficulty } from 'common/enums/problem.enum'
import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'
import { Course } from './course.entity'

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

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(() => Course, (course) => course.problems, { onDelete: 'CASCADE' })
    course: Course
}
