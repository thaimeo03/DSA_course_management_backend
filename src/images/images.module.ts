import { Module } from '@nestjs/common'
import { ImagesService } from './images.service'
import { MulterModule } from '@nestjs/platform-express'
import { ImagesController } from './images.controller'
import { MulterConfigService } from './multer-config.service'
import { CloudinaryService } from './cloudinary.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Image } from 'database/entities/image.entity'

@Module({
    imports: [MulterModule.registerAsync({ useClass: MulterConfigService }), TypeOrmModule.forFeature([Image])],
    providers: [ImagesService, CloudinaryService],
    controllers: [ImagesController],
    exports: [ImagesService]
})
export class ImagesModule {}
