import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { UploadImageBodyDto } from './dto/upload-image-body.dto'
import { ImagesService } from './images.service'
import { DataResponse } from 'common/core/response-success.core'

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('images', 5))
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[], @Body() uploadImageBodyDto: UploadImageBodyDto) {
    const data = await this.imagesService.uploadImages({
      files,
      cloudFolder: uploadImageBodyDto.cloudFolder
    })

    return new DataResponse({
      message: 'Upload images file success',
      data
    })
  }
}
