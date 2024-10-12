import { BadRequestException, Injectable } from '@nestjs/common'
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express'
import { allowedExtensions, maxFileSize } from 'common/constants/constraints/image.constraint'
import { ImageMessages } from 'common/constants/messages/image.message'
import { extname } from 'path'

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    // 1. File Filter - extension and size validation
    // 2. Local destination
    createMulterOptions(): MulterModuleOptions {
        return {
            // 1
            fileFilter(req, file, callback) {
                const ext = extname(file.originalname)

                if (!allowedExtensions.includes(ext)) {
                    return callback(new BadRequestException(ImageMessages.TYPE_NOT_ALLOWED), false)
                }

                const fileSize = file.size
                if (fileSize > maxFileSize) {
                    return callback(new BadRequestException(ImageMessages.FILE_IS_TOO_LARGE), false)
                }

                callback(null, true)
            },
            // 2
            dest: './uploads/images'
        }
    }
}
