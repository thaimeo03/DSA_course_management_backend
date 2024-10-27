import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator'
import { ProgrammingLanguage } from 'common/enums/index.enum'

export class CreateTemplateDto {
    @IsNotEmpty()
    @IsString()
    code: string

    @IsNotEmpty()
    @IsEnum(ProgrammingLanguage)
    language: ProgrammingLanguage

    @IsNotEmpty()
    @IsUUID()
    problemId: string
}