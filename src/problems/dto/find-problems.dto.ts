import { IsEnum, IsOptional, MinLength } from 'class-validator'
import { PaginationDto } from 'common/dto/pagination.dto'
import { Order } from 'common/enums/index.enum'
import { SortBy } from 'common/enums/problems.enum'

export class FindProblemsDto extends PaginationDto {
    @IsOptional()
    @IsEnum(SortBy)
    sortBy?: SortBy

    @IsOptional()
    @IsEnum(Order)
    order?: Order

    @IsOptional()
    @MinLength(1)
    search?: string
}
