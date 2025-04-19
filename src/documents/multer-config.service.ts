import { BadRequestException, Injectable } from '@nestjs/common'
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express'
import {
    ALLOWED_DOCUMENT_MIME_TYPES,
    MAX_DOCUMENT_SIZE
} from 'common/constants/constraints/document.constraint'

@Injectable()
export class DocumentMulterConfigService implements MulterOptionsFactory {
    // 1. File Filter - extension and size validation
    // 2. Local destination
    createMulterOptions(): MulterModuleOptions {
        return {
            // 1
            fileFilter(req, file, callback) {
                if (!ALLOWED_DOCUMENT_MIME_TYPES.includes(file.mimetype)) {
                    return callback(
                        new BadRequestException(
                            'Only documents are allowed. Accepted extensions are pdf, docx, pptx'
                        ),
                        false
                    )
                }

                const fileSize = parseInt(req.headers['content-length'])
                if (fileSize > MAX_DOCUMENT_SIZE) {
                    return callback(
                        new BadRequestException('File is too large. Max file size is 20MB'),
                        false
                    )
                }

                callback(null, true)
            },
            // 2
            dest: './uploads/documents'
        }
    }
}
