import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
    Min,
    MinLength
} from 'class-validator'

export class CreateCourseDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    title: string

    @IsOptional()
    @IsString()
    description?: string

    @IsNotEmpty()
    @IsUrl()
    thumbnail: string

    @IsNotEmpty()
    @IsNumber()
    @Min(15000) // Should be greater than 15.000  because of payment policy
    price: number
}
