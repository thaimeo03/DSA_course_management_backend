import { Problem } from 'database/entities/problem.entity'
import { FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from 'typeorm'

export class FindProblemOptionDto {
    where?: FindOptionsWhere<Problem> | FindOptionsWhere<Problem>[]
    select?: FindOptionsSelect<Problem>
    relations?: FindOptionsRelations<Problem>
}
