import { SubmissionStatus } from 'common/enums/submissions.enum'
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn
} from 'typeorm'
import { Problem } from './problem.entity'
import { User } from './user.entity'
import { SourceCode } from './source-code.entity'

@Entity('Submissions')
export class Submission {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'enum', enum: SubmissionStatus })
    status: SubmissionStatus

    @CreateDateColumn()
    createdAt: Date

    @ManyToOne(() => Problem, (problem) => problem.submissions, { onDelete: 'CASCADE' })
    problem: Problem

    @ManyToOne(() => User, (user) => user.submissions)
    user: User

    @OneToOne(() => SourceCode, { onDelete: 'CASCADE' })
    @JoinColumn()
    sourceCode: SourceCode
}
