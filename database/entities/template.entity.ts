import { ProgrammingLanguage } from 'common/enums/index.enum'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Problem } from './problem.entity'

@Entity('Templates')
export class Template {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'text' })
    code: string

    @Column({ type: 'enum', enum: ProgrammingLanguage })
    language: ProgrammingLanguage

    @ManyToOne(() => Problem, (problem) => problem.templates)
    problem: Problem
}
