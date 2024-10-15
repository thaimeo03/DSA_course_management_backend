import { IsEnum, IsOptional } from 'class-validator'
import { PaginationDto } from 'common/dto/pagination.dto'
import { SortBy } from 'common/enums/courses.enum'
import { Order } from 'common/enums/index.enum'

export class FindAllCourseDto extends PaginationDto {
    @IsOptional()
    @IsEnum(SortBy)
    sortBy?: SortBy

    @IsOptional()
    @IsEnum(Order)
    order?: Order
}
