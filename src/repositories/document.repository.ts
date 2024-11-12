import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DocumentMessages } from 'common/constants/messages/document.message'
import { Document } from 'database/entities/document.entity'
import { Repository } from 'typeorm'

@Injectable()
export class DocumentRepository extends Repository<Document> {
    constructor(@InjectRepository(Document) private documentRepository: Repository<Document>) {
        super(documentRepository.target, documentRepository.manager, documentRepository.queryRunner)
    }

    // 1. Check document exists, if not throw error
    // 2. Return document
    async checkDocumentExists(id: string) {
        // 1
        const document = await this.documentRepository.findOneBy({ id })
        if (!document) throw new NotFoundException(DocumentMessages.DOCUMENT_NOT_FOUND)

        // 2
        return document
    }
}
