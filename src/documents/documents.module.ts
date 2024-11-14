import { Module } from '@nestjs/common'
import { DocumentsController } from './documents.controller'
import { DocumentsService } from './documents.service'
import { Document } from 'database/entities/document.entity'
import { Lesson } from 'database/entities/lesson.entity'
import { DocumentRepository } from 'src/repositories/document.repository'
import { LessonRepository } from 'src/repositories/lesson.repository'
import { RepositoriesModule } from 'src/repositories/repositories.module'

@Module({
    imports: [
        RepositoriesModule.register([Document, Lesson], [DocumentRepository, LessonRepository])
    ],
    controllers: [DocumentsController],
    providers: [DocumentsService]
})
export class DocumentsModule {}
