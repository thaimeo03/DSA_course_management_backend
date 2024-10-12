import { Body, Controller, Delete, Param, Post } from '@nestjs/common'
import { DocumentsService } from './documents.service'
import { CreateDocumentDto } from './dto/create-document.dto'
import { DataResponse } from 'common/core/response-success.core'
import { DocumentMessages } from 'common/constants/messages/document.message'

@Controller('documents')
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) {}

    @Post()
    async createDocument(@Body() createDocumentDto: CreateDocumentDto) {
        const data = await this.documentsService.createDocument(createDocumentDto)

        return new DataResponse({ message: DocumentMessages.CREATE_DOCUMENT_SUCCESS, data })
    }

    @Delete(':id')
    async deleteDocument(@Param('id') id: string) {
        await this.documentsService.deleteDocument(id)

        return new DataResponse({ message: DocumentMessages.DELETE_DOCUMENT_SUCCESS })
    }
}
