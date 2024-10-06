import { Injectable } from '@nestjs/common'
import { CloudinaryService } from './cloudinary.service'
import { UploadImagesDto } from './dto/upload-images.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Image } from 'database/entities/image.entity'

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image) private imageRepository: Repository<Image>,
    private cloudinaryService: CloudinaryService
  ) {}

  // Upload images to cloudinary
  async uploadImages(uploadImagesDto: UploadImagesDto) {
    const { files, cloudFolder } = uploadImagesDto

    const urls = await Promise.all(
      files.map(async (file) => {
        const uploadResult = await this.cloudinaryService.uploadImage({
          file,
          cloudFolder
        })

        return uploadResult
      })
    )

    return urls
  }

  // Delete images from cloudinary and database
  async deleteImages(urls: string[]) {
    await Promise.all(
      urls.map(async (url) => {
        const image = await this.imageRepository.findOneBy({ url })
        if (!image) return

        Promise.all([
          await this.cloudinaryService.deleteImage(image.publicId),
          await this.imageRepository.delete(image.id)
        ])
      })
    )
  }
}