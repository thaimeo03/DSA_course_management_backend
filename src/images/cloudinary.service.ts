import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UploadImageDto } from './dto/upload-image.dto'
import { v2 as cloudinary } from 'cloudinary'
import * as fs from 'fs'

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    this.handleConfig()
  }

  handleConfig() {
    const cloudName = this.configService.get('CLOUDINARY_CLOUD_NAME')
    const apiKey = this.configService.get('CLOUDINARY_API_KEY')
    const apiSecret = this.configService.get('CLOUDINARY_API_SECRET')

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Cloudinary configuration is not complete')
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret
    })
  }

  async uploadImage(uploadImageDto: UploadImageDto) {
    const { file, cloudFolder } = uploadImageDto

    if (!file.path) {
      throw new NotFoundException('File not found')
    }

    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: `DSA_course_management_images/${cloudFolder}`
    })

    const optimizeUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto',
      quality: 'auto'
    })

    // Delete local file after upload
    fs.unlinkSync(file.path)

    return optimizeUrl
  }
}
