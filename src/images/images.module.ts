import { Module } from '@nestjs/common'
import { ImagesService } from './images.service'
import { MulterModule } from '@nestjs/platform-express'
import { ImagesController } from './images.controller'
import { MulterConfigService } from './multer-config.service'
import { Repository } from 'database/entities/repository.entity'
import { CloudRepository } from 'src/repositories/cloud.repository'
import { RepositoriesModule } from 'src/repositories/repositories.module'
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module'

@Module({
    imports: [
        MulterModule.registerAsync({ useClass: MulterConfigService }),
        RepositoriesModule.register([Repository], [CloudRepository]),
        CloudinaryModule
    ],
    providers: [ImagesService],
    controllers: [ImagesController],
    exports: [ImagesService]
})
export class ImagesModule {}
