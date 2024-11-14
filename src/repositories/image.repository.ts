import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Image } from 'database/entities/image.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ImageRepository extends Repository<Image> {
    constructor(@InjectRepository(Image) private imageRepository: Repository<Image>) {
        super(imageRepository.target, imageRepository.manager, imageRepository.queryRunner)
    }
}
