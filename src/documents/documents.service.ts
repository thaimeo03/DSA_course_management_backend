import { Injectable } from '@nestjs/common'
import { CreateDocumentDto } from './dto/create-document.dto'
import * as _ from 'lodash'
import { UpdateDocumentDto } from './dto/update-docuement.dto'
import { DocumentRepository } from 'src/repositories/document.repository'
import { LessonRepository } from 'src/repositories/lesson.repository'

@Injectable()
export class DocumentsService {
    constructor(
        private documentRepository: DocumentRepository,
        private lessonRepository: LessonRepository
    ) {}

    // 1. Check lesson exists
    // 2. Save document
    async createDocument(createDocumentDto: CreateDocumentDto) {
        // 1
        const lesson = await this.lessonRepository.checkLessonExists(createDocumentDto.lessonId)

        // 2
        const document = await this.documentRepository.save({
            ...createDocumentDto,
            lesson
        })

        return _.omit(document, ['lesson'])
    }

    // 1. Check document exists
    // 2. Delete document
    async deleteDocument(id: string) {
        // 1
        await this.documentRepository.checkDocumentExists(id)

        // 2
        await this.documentRepository.delete(id)
    }

    // 1. Check document exists
    // 2. Update document
    async updateDocument(id: string, updateDocumentDto: UpdateDocumentDto) {
        // 1
        await this.documentRepository.checkDocumentExists(id)

        // 2
        await this.documentRepository.update(id, updateDocumentDto)
    }

    // 1. Check lesson exists
    // 2. Find all documents
    async findDocumentsByLessonId(lessonId: string) {
        // 1
        await this.lessonRepository.checkLessonExists(lessonId)

        // 2
        const documents = await this.documentRepository.find({
            where: { lesson: { id: lessonId } },
            relations: { lesson: true },
            order: { createdAt: 'ASC' },
            select: {
                lesson: {}
            }
        })

        return documents
    }
}
