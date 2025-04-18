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
import { Document } from './document.entity'

@Entity('Lessons')
export class Lesson {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'smallint' })
    no: number

    @Column({ type: 'varchar', length: 300 })
    title: string

    @Column({ type: 'text', nullable: true })
    content: string

    @Column({ type: 'varchar' })
    videoUrl: string

    @Column({ type: 'boolean', default: false })
    isActive: boolean

    @Column({ type: 'boolean', default: false })
    isArchived: boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(() => Course, (course) => course.lessons, { onDelete: 'CASCADE' })
    course: Course

    @OneToMany(() => Document, (document) => document.lesson)
    documents: Document[]
}
