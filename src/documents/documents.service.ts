import { Injectable } from '@nestjs/common'
import { CreateDocumentDto } from './dto/create-document.dto'
import * as _ from 'lodash'
import { UpdateDocumentDto } from './dto/update-docuement.dto'
import { DocumentRepository } from 'src/repositories/document.repository'
import { LessonRepository } from 'src/repositories/lesson.repository'
import { CloudinaryService } from 'src/cloudinary/cloudinary.service'
import { CloudRepository } from 'src/repositories/cloud.repository'
import { UploadDocumentDto } from './dto/upload-document.dto'
import { FileType } from 'common/enums/repository.enum'

@Injectable()
export class DocumentsService {
    constructor(
        private documentRepository: DocumentRepository,
        private lessonRepository: LessonRepository,
        private cloudinaryService: CloudinaryService,
        private cloudRepository: CloudRepository
    ) {}

    // Upload document file to cloudinary
    async uploadDocument(uploadDocumentDto: UploadDocumentDto) {
        const { file, cloudFolder } = uploadDocumentDto

        const fileUrl = await this.cloudinaryService.uploadFile({
            file,
            cloudFolder: cloudFolder,
            fileType: FileType.Document
        })

        return fileUrl
    }

    // 1. Check lesson exists
    // 2. Save document
    async createDocument(createDocumentDto: CreateDocumentDto) {
        // 1
        const lesson = await this.lessonRepository.checkLessonExists({
            id: createDocumentDto.lessonId
        })

        // 2
        const document = await this.documentRepository.save({
            ...createDocumentDto,
            lesson
        })

        return _.omit(document, ['lesson'])
    }

    async deleteDocument(id: string) {
        // 1. Get document
        const document = await this.documentRepository.checkDocumentExists({ id })

        // 2. Get cloud file record by URL
        const cloudFile = await this.cloudRepository.findOneBy({ url: document.fileUrl })

        // 3. Delete from cloudinary if found
        if (cloudFile) {
            await this.cloudinaryService.deleteFile(cloudFile.publicId)
            await this.cloudRepository.delete(cloudFile.id)
        }

        // 4. Delete document from database
        await this.documentRepository.delete(id)
    }

    // 1. Check document exists
    // 2. Update document
    async updateDocument(id: string, updateDocumentDto: UpdateDocumentDto) {
        // 1
        await this.documentRepository.checkDocumentExists({ id })

        // 2
        await this.documentRepository.update(id, updateDocumentDto)
    }

    // 1. Check lesson exists
    // 2. Find all documents
    async findDocumentsByLessonId(lessonId: string) {
        // 1
        await this.lessonRepository.checkLessonExists({ id: lessonId })

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
