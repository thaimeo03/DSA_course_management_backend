import { Module } from '@nestjs/common'
import { DocumentsController } from './documents.controller'
import { DocumentsService } from './documents.service'
import { Document } from 'database/entities/document.entity'
import { Lesson } from 'database/entities/lesson.entity'
import { DocumentRepository } from 'src/repositories/document.repository'
import { LessonRepository } from 'src/repositories/lesson.repository'
import { RepositoriesModule } from 'src/repositories/repositories.module'
import { MulterModule } from '@nestjs/platform-express'
import { DocumentMulterConfigService } from './multer-config.service'
import { Repository } from 'database/entities/repository.entity'
import { CloudRepository } from 'src/repositories/cloud.repository'
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module'

@Module({
    imports: [
        MulterModule.registerAsync({ useClass: DocumentMulterConfigService }),
        RepositoriesModule.register(
            [Document, Lesson, Repository],
            [DocumentRepository, LessonRepository, CloudRepository]
        ),
        CloudinaryModule
    ],
    controllers: [DocumentsController],
    providers: [DocumentsService]
})
export class DocumentsModule {}
