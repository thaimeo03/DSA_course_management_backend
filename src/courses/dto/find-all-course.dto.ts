import { IsEnum } from 'class-validator'
import { PaginationDto } from 'common/dto/pagination.dto'
import { SortBy } from 'common/enums/courses.enum'

export class FindAllCourseDto extends PaginationDto {
    @IsEnum(SortBy)
    sortBy: SortBy
}
