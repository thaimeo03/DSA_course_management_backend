import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    IsUUID,
    MaxLength,
    MinLength
} from 'class-validator'

export class CreateLessonDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(300)
    title: string

    @IsOptional()
    @IsString()
    content?: string

    @IsNotEmpty()
    @IsString()
    @IsUrl()
    videoUrl: string

    @IsNotEmpty()
    @IsUUID()
    courseId: string
}
