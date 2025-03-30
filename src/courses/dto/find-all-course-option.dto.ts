import { Course } from 'database/entities/course.entity'
import { FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from 'typeorm'

export class FindAllCourseOptionDto {
    where?: FindOptionsWhere<Course> | FindOptionsWhere<Course>[]
    select?: FindOptionsSelect<Course>
    relations?: FindOptionsRelations<Course>
}
