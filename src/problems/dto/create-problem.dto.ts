import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
    Min,
    MinLength
} from 'class-validator'
import { Difficulty } from 'common/enums/problem.enum'

export class CreateProblemDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(300)
    title: string

    @IsOptional()
    @IsString()
    content?: string

    @IsOptional()
    @IsNumber()
    @Min(0)
    point?: number

    @IsOptional()
    @IsEnum(Difficulty)
    difficulty: Difficulty

    @IsNotEmpty()
    @IsUUID()
    courseId: string
}
