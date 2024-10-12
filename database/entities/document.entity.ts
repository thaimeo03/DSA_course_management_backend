import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { Lesson } from './lesson.entity'

@Entity('Documents')
export class Document {
    @PrimaryColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 300 })
    title: string

    @Column({ type: 'varchar' })
    fileUrl: string

    @CreateDateColumn()
    createdAt: Date

    @ManyToOne(() => Lesson, (lesson) => lesson.documents)
    lesson: Lesson
}
