import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Problem } from './problem.entity'

@Entity('Test_Suit')
export class TestSuit {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', array: true })
    inputTypes: string[]

    @Column({ type: 'text' })
    inputSuit: string

    @Column({ type: 'text' })
    expectedOutputSuit: string

    @OneToOne(() => Problem, { onDelete: 'CASCADE' })
    @JoinColumn()
    problem: Problem
}
