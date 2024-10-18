import { SubmissionStatus } from 'common/enums/submissions.enum'
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { SourceCode } from './source-code.entity'
import { Problem } from './problem.entity'
import { User } from './user.entity'

@Entity('Submissions')
export class Submission {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'enum', enum: SubmissionStatus, default: SubmissionStatus.Pending })
    status: SubmissionStatus

    @CreateDateColumn()
    createdAt: Date

    @ManyToOne(() => SourceCode, (sourceCode) => sourceCode.submissions)
    sourceCode: SourceCode

    @ManyToOne(() => Problem, (problem) => problem.submissions)
    problem: Problem

    @ManyToOne(() => User, (user) => user.submissions)
    user: User
}
