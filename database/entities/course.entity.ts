import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('Courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 200 })
  title: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({ type: 'varchar' })
  thumbnail: string

  @Column({ type: 'real' })
  price: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
