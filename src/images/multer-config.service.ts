import { BadRequestException, Injectable } from '@nestjs/common'
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express'
import { extname } from 'path'

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      fileFilter(req, file, callback) {
        const ext = extname(file.originalname)

        const allowedExtensions = ['.png', '.jpg', '.jpeg']

        if (!allowedExtensions.includes(ext)) {
          return callback(
            new BadRequestException('Only images are allowed. Accepted extensions are png, jpg, jpeg'),
            false
          )
        }

        const fileSize = file.size
        if (fileSize > 5 * 1024 * 1024) {
          return callback(new BadRequestException('File is too large. Max file size is 5MB'), false)
        }

        callback(null, true)
      },
      dest: './uploads/images'
    }
  }
}
