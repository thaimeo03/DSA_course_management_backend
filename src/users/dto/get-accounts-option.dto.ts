import { User } from 'database/entities/user.entity'
import { FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from 'typeorm'

export class GetAccountsOptionDto {
    where?: FindOptionsWhere<User> | FindOptionsWhere<User>[]
    select?: FindOptionsSelect<User>
    relations?: FindOptionsRelations<User>
}
