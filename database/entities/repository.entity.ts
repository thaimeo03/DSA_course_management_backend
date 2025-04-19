import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('Repositories')
export class Repository {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', unique: true })
    url: string

    @Column({ type: 'varchar' })
    publicId: string
}
