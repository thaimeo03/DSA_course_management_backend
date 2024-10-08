import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Course } from './course.entity'

@Entity('Lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 300 })
  title: string

  @Column({ type: 'text', nullable: true })
  content: string

  @Column({ type: 'varchar' })
  videoUrl: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => Course, (course) => course.lessons)
  course: Course
}
