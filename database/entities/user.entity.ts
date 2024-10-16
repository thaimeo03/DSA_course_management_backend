import { Role } from 'common/enums/users.enum'
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'
import { Submission } from './submission.entity'

@Entity('Users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 100 })
    fullName: string

    @Column({ type: 'varchar', length: 100, unique: true })
    email: string

    @Column({ type: 'varchar' })
    password: string

    @Column({ type: 'varchar', nullable: true, unique: true })
    refreshToken: string

    @Column({ type: 'enum', enum: Role, default: Role.Student })
    role: Role

    @Column({ type: 'varchar', nullable: true })
    avatar: string

    @Column({ type: 'date', nullable: true })
    dateOfBirth: Date

    @Column({ type: 'boolean', default: false })
    verified: boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(() => Submission, (submission) => submission.user)
    submissions: Submission[]
}
