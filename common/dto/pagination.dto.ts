import { Transform } from 'class-transformer'
import { IsEnum, IsNumber, IsOptional } from 'class-validator'
import { HavePagination } from 'common/enums/index.enum'

export class PaginationDto {
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    page?: number

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    limit?: number

    @IsOptional()
    @IsEnum(HavePagination)
    paging?: HavePagination
}
