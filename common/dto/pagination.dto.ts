import { Transform } from 'class-transformer'
import { IsNumber, IsOptional } from 'class-validator'

export class PaginationDto {
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    page?: number

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    limit?: number
}
