import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UploadImageDto } from './dto/upload-image.dto'
import { v2 as cloudinary } from 'cloudinary'
import { ImageMessages } from 'common/constants/messages/image.message'
import * as fs from 'fs'
import { InjectRepository } from '@nestjs/typeorm'
import { Image } from 'database/entities/image.entity'
import { Repository } from 'typeorm'

@Injectable()
export class CloudinaryService {
  constructor(
    @InjectRepository(Image) private imageRepository: Repository<Image>,
    private configService: ConfigService
  ) {
    this.handleConfig()
  }

  handleConfig() {
    const cloudName = this.configService.get('CLOUDINARY_CLOUD_NAME')
    const apiKey = this.configService.get('CLOUDINARY_API_KEY')
    const apiSecret = this.configService.get('CLOUDINARY_API_SECRET')

    if (!cloudName || !apiKey || !apiSecret) {
      throw new InternalServerErrorException(ImageMessages.CONFIG_FAIL)
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret
    })
  }

  // 1. Check file exists
  // 2. Upload file to cloudinary
  // 3. Optimize url
  // 4. Save url, public_id to DB and delete local file
  async uploadImage(uploadImageDto: UploadImageDto) {
    // 1
    const { file, cloudFolder } = uploadImageDto

    if (!file.path) {
      throw new NotFoundException(ImageMessages.FILE_NOT_FOUND)
    }

    // 2
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: `DSA_course_management_images/${cloudFolder}` // folder name in cloudinary
    })

    // 3
    const optimizeUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto',
      quality: 'auto'
    })

    // 4
    try {
      await this.imageRepository.save({
        url: optimizeUrl,
        publicId: uploadResult.public_id
      })
    } catch (error) {
      this.deleteImage(uploadResult.public_id)
    }

    fs.unlinkSync(file.path)

    return optimizeUrl
  }

  async deleteImage(publicId: string) {
    await cloudinary.uploader.destroy(publicId)
  }
}
