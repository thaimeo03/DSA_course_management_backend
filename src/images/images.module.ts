import { Module } from '@nestjs/common'
import { ImagesService } from './images.service'
import { MulterModule } from '@nestjs/platform-express'
import { ImagesController } from './images.controller'
import { MulterConfigService } from './multer-config.service'
import { CloudinaryService } from './cloudinary.service'
import { Image } from 'database/entities/image.entity'
import { ImageRepository } from 'src/repositories/image.repository'
import { RepositoriesModule } from 'src/repositories/repositories.module'

@Module({
    imports: [
        MulterModule.registerAsync({ useClass: MulterConfigService }),
        RepositoriesModule.register([Image], [ImageRepository])
    ],
    providers: [ImagesService, CloudinaryService],
    controllers: [ImagesController],
    exports: [ImagesService]
})
export class ImagesModule {}
