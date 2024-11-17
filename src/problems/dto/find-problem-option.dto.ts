import { Problem } from 'database/entities/problem.entity'
import { FindOptionsSelect, FindOptionsWhere } from 'typeorm'

export class FindProblemOptionDto {
    where?: FindOptionsWhere<Problem> | FindOptionsWhere<Problem>[]
    select?: FindOptionsSelect<Problem>
}
