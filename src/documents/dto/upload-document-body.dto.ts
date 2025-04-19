import { IsEnum, IsNotEmpty } from 'class-validator'
import { CloudinaryDocumentFolder } from 'common/enums/documents.enum'

export class UploadDocumentBodyDto {
    @IsNotEmpty()
    @IsEnum(CloudinaryDocumentFolder)
    cloudFolder: CloudinaryDocumentFolder
}
