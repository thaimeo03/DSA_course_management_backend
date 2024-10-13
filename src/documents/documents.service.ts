import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateDocumentDto } from './dto/create-document.dto'
import { Document } from 'database/entities/document.entity'
import { Lesson } from 'database/entities/lesson.entity'
import { LessonMessages } from 'common/constants/messages/lesson.message'
import { DocumentMessages } from 'common/constants/messages/document.message'
import * as _ from 'lodash'
import { UpdateDocumentDto } from './dto/update-docuement.dto'

@Injectable()
export class DocumentsService {
    constructor(
        @InjectRepository(Document) private documentsRepository: Repository<Document>,
        @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>
    ) {}

    // 1. Check lesson exists
    // 2. Save document
    async createDocument(createDocumentDto: CreateDocumentDto) {
        // 1
        const lesson = await this.lessonRepository.findOneBy({ id: createDocumentDto.lessonId })
        if (!lesson) throw new NotFoundException(LessonMessages.LESSON_NOT_FOUND)

        // 2
        const document = await this.documentsRepository.save({
            ...createDocumentDto,
            lesson
        })

        return _.omit(document, ['lesson'])
    }

    // 1. Check document exists
    // 2. Delete document
    async deleteDocument(id: string) {
        // 1
        const document = await this.documentsRepository.findOneBy({ id })
        if (!document) throw new NotFoundException(DocumentMessages.DOCUMENT_NOT_FOUND)

        // 2
        await this.documentsRepository.delete(id)
    }

    // 1. Check document exists
    // 2. Update document
    async updateDocument(id: string, updateDocumentDto: UpdateDocumentDto) {
        const document = await this.documentsRepository.findOneBy({ id })
        if (!document) throw new NotFoundException(DocumentMessages.DOCUMENT_NOT_FOUND)

        await this.documentsRepository.update(id, updateDocumentDto)
    }
}
