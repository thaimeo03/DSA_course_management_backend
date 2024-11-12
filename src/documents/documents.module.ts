import { Module } from '@nestjs/common'
import { DocumentsController } from './documents.controller'
import { DocumentsService } from './documents.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Document } from 'database/entities/document.entity'
import { Lesson } from 'database/entities/lesson.entity'
import { DocumentRepository } from 'src/repositories/document.repository'
import { LessonRepository } from 'src/repositories/lesson.repository'

@Module({
    imports: [TypeOrmModule.forFeature([Document, Lesson])],
    controllers: [DocumentsController],
    providers: [DocumentsService, DocumentRepository, LessonRepository]
})
export class DocumentsModule {}
