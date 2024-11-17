import { Course } from 'database/entities/course.entity'
import { FindOptionsSelect, FindOptionsWhere } from 'typeorm'

export class FindAllCourseOptionDto {
    where?: FindOptionsWhere<Course> | FindOptionsWhere<Course>[]
    select?: FindOptionsSelect<Course>
}
