import { Body, Controller, Delete, Post, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { UploadImageBodyDto } from './dto/upload-image-body.dto'
import { ImagesService } from './images.service'
import { DataResponse } from 'common/core/response-success.core'
import { ImageMessages } from 'common/constants/messages/image.message'
import { DeleteImagesDto } from './dto/delete-images.dto'

@Controller('images')
export class ImagesController {
    constructor(private readonly imagesService: ImagesService) {}

    @Post('upload')
    @UseInterceptors(FilesInterceptor('images', 5))
    async uploadFiles(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() uploadImageBodyDto: UploadImageBodyDto
    ) {
        const data = await this.imagesService.uploadImages({
            files,
            cloudFolder: uploadImageBodyDto.cloudFolder
        })

        return new DataResponse({
            message: ImageMessages.UPLOAD_SUCCESS,
            data
        })
    }

    @Delete('delete')
    async deleteFiles(@Body() deleteImagesDto: DeleteImagesDto) {
        await this.imagesService.deleteImages(deleteImagesDto.urls)

        return new DataResponse({
            message: ImageMessages.DELETE_SUCCESS
        })
    }
}
