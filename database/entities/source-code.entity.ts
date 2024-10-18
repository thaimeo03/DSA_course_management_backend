import { ProgrammingLanguage } from 'common/enums/index.enum'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Submission } from './submission.entity'

@Entity('Source_Codes')
export class SourceCode {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'text' })
    code: string

    @Column({ type: 'enum', enum: ProgrammingLanguage })
    language: ProgrammingLanguage

    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(() => Submission, (submission) => submission.sourceCode)
    submissions: Submission[]
}
