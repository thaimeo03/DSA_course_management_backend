import { Transform } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator'
import { ProgrammingLanguage } from 'common/enums/index.enum'

export class FindTemplateByProblemIdAndLanguageDto {
    @IsNotEmpty()
    @IsUUID()
    problemId: string

    @IsNotEmpty()
    @IsEnum(ProgrammingLanguage)
    @Transform((obj) => Number(obj.value))
    language: ProgrammingLanguage
}
