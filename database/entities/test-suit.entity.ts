import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Problem } from './problem.entity'
import { DataTypes } from 'common/enums/test-suits.enum'

@Entity('Test_Suits')
export class TestSuit {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 100 })
    functionName: string

    @Column({ type: 'enum', enum: DataTypes, array: true })
    inputTypes: DataTypes[]

    @Column({ type: 'text' })
    inputSuit: string

    @Column({ type: 'enum', enum: DataTypes })
    outputType: DataTypes

    @Column({ type: 'text' })
    expectedOutputSuit: string

    @OneToOne(() => Problem, { onDelete: 'CASCADE' })
    @JoinColumn()
    problem: Problem
}
