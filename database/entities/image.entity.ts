import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('Images')
export class Image {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', unique: true })
    url: string

    @Column({ type: 'varchar' })
    publicId: string
}
