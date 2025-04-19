import { FileType } from 'common/enums/repository.enum'

export class UploadFileDto {
    file: Express.Multer.File
    cloudFolder: string
    fileType: FileType
}
