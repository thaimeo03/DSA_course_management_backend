import { Module } from '@nestjs/common'
import { ImagesService } from './images.service'
import { MulterModule } from '@nestjs/platform-express'
import { ImagesController } from './images.controller'
import { MulterConfigService } from './multer-config.service'
import { CloudinaryService } from './cloudinary.service'

@Module({
  imports: [MulterModule.registerAsync({ useClass: MulterConfigService })],
  providers: [ImagesService, CloudinaryService],
  controllers: [ImagesController]
})
export class ImagesModule {}
