import { Module } from '@nestjs/common'
import { DocumentsController } from './documents.controller'
import { DocumentsService } from './documents.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Document } from 'database/entities/document.entity'
import { Lesson } from 'database/entities/lesson.entity'

@Module({
    imports: [TypeOrmModule.forFeature([Document, Lesson])],
    controllers: [DocumentsController],
    providers: [DocumentsService]
})
export class DocumentsModule {}
