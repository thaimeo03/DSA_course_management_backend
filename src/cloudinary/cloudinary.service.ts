import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ImageMessages } from 'common/constants/messages/image.message'
import { CloudRepository } from 'src/repositories/cloud.repository'
import { v2 as cloudinary, UploadApiOptions } from 'cloudinary'
import { UploadFileDto } from './dto/upload-file.dto'
import * as fs from 'fs'
import { CLOUDINARY_FOLDER_PATH } from 'common/constants/keys/cloudinary.key'
import { FileType } from 'common/enums/repository.enum'

@Injectable()
export class CloudinaryService {
    constructor(
        private cloudRepository: CloudRepository,
        private configService: ConfigService
    ) {
        this.initConfig()
    }

    private initConfig() {
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

    async uploadFile(uploadFileDto: UploadFileDto) {
        // Get file path from the request
        const { file, cloudFolder, fileType } = uploadFileDto

        if (!file.path) {
            throw new NotFoundException(ImageMessages.FILE_NOT_FOUND)
        }

        // Upload file to Cloudinary
        const uploadOptions: UploadApiOptions = {
            folder: `${CLOUDINARY_FOLDER_PATH[fileType]}/${cloudFolder}`
        }

        if (fileType === FileType.Document) {
            ;(uploadOptions['resource_type'] = 'auto'),
                (uploadOptions['format'] = file.originalname.split('.').pop())
        }

        const uploadResult = await cloudinary.uploader.upload(file.path, uploadOptions)

        // Get the URL of the uploaded file
        let fileUrl: string
        if (fileType === FileType.Document) {
            fileUrl = uploadResult.url
        } else {
            // For images, apply optimization
            fileUrl = cloudinary.url(uploadResult.public_id, {
                fetch_format: 'auto',
                quality: 'auto'
            })
        }

        // Save the file URL and public ID to the database
        try {
            await this.cloudRepository.save({
                url: fileUrl,
                publicId: uploadResult.public_id
            })
        } catch (error) {
            this.deleteFile(uploadResult.public_id)
        }

        fs.unlinkSync(file.path)

        return fileUrl
    }

    async deleteFile(publicId: string) {
        await cloudinary.uploader.destroy(publicId)
    }
}
