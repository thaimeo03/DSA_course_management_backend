import { Injectable } from '@nestjs/common'
import { CloudinaryService } from './cloudinary.service'
import { UploadImagesDto } from './dto/upload-images.dto'

@Injectable()
export class ImagesService {
  constructor(private cloudinaryService: CloudinaryService) {}

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
}
