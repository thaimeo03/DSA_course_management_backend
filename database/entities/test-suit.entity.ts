import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Problem } from './problem.entity'
import { InputTypes } from 'common/enums/test-suits.enum'

@Entity('Test_Suits')
export class TestSuit {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'enum', enum: InputTypes, array: true })
    inputTypes: InputTypes[]

    @Column({ type: 'text' })
    inputSuit: string

    @Column({ type: 'text' })
    expectedOutputSuit: string

    @OneToOne(() => Problem, { onDelete: 'CASCADE' })
    @JoinColumn()
    problem: Problem
}
