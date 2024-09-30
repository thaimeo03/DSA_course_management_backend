import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar' })
  fullName: string
}
