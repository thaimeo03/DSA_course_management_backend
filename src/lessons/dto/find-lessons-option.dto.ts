import { Lesson } from 'database/entities/lesson.entity'
import { FindOptionsSelect, FindOptionsWhere } from 'typeorm'

export class FindLessonsOptionDto {
    where?: FindOptionsWhere<Lesson> | FindOptionsWhere<Lesson>[]
    select?: FindOptionsSelect<Lesson>
}
