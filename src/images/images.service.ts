import { Injectable } from '@nestjs/common'
import { UploadImagesDto } from './dto/upload-images.dto'
import { CloudRepository } from 'src/repositories/cloud.repository'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'
import { FileType } from 'common/enums/repository.enum'

@Injectable()
export class ImagesService {
    constructor(
        private imageRepository: CloudRepository,
        private cloudinaryService: CloudinaryService
    ) {}

    // Upload images to cloudinary
    async uploadImages(uploadImagesDto: UploadImagesDto) {
        const { files, cloudFolder } = uploadImagesDto

        const urls = await Promise.all(
            files.map(async (file) => {
                const uploadResult = await this.cloudinaryService.uploadFile({
                    file,
                    cloudFolder,
                    fileType: FileType.Image
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
                    await this.cloudinaryService.deleteFile(image.publicId),
                    await this.imageRepository.delete(image.id)
                ])
            })
        )
    }
}
