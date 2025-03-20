import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    IsUUID,
    MaxLength,
    Min,
    MinLength
} from 'class-validator'

export class CreateLessonDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(300)
    title: string

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    no?: number

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
