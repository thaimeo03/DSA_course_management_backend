import { IsNotEmpty, IsString, IsUrl, IsUUID, MaxLength, MinLength } from 'class-validator'

export class CreateDocumentDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(300)
    title: string

    @IsNotEmpty()
    @IsUrl()
    fileUrl: string

    @IsNotEmpty()
    @IsUUID()
    lessonId: string
}
