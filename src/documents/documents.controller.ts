import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { DocumentsService } from './documents.service'
import { CreateDocumentDto } from './dto/create-document.dto'
import { DataResponse } from 'common/core/response-success.core'
import { DocumentMessages } from 'common/constants/messages/document.message'
import { UpdateDocumentDto } from './dto/update-docuement.dto'

@Controller('documents')
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) {}

    @Post()
    async createDocument(@Body() createDocumentDto: CreateDocumentDto) {
        const data = await this.documentsService.createDocument(createDocumentDto)

        return new DataResponse({ message: DocumentMessages.CREATE_DOCUMENT_SUCCESS, data })
    }

    @Get('/lesson/:lessonId')
    async findDocumentsByLessonId(@Param('lessonId') lessonId: string) {
        const data = await this.documentsService.findDocumentsByLessonId(lessonId)

        return new DataResponse({
            message: DocumentMessages.FIND_DOCUMENTS_BY_LESSON_SUCCESS,
            data
        })
    }

    @Patch(':id')
    async updateDocument(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
        await this.documentsService.updateDocument(id, updateDocumentDto)

        return new DataResponse({ message: DocumentMessages.UPDATE_DOCUMENT_SUCCESS })
    }

    @Delete(':id')
    async deleteDocument(@Param('id') id: string) {
        await this.documentsService.deleteDocument(id)

        return new DataResponse({ message: DocumentMessages.DELETE_DOCUMENT_SUCCESS })
    }
}
