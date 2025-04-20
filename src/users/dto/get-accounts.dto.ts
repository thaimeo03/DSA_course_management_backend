import { IsOptional, MinLength } from 'class-validator'
import { PaginationDto } from 'common/dto/pagination.dto'

export class GetAccountsDto extends PaginationDto {
    @IsOptional()
    @MinLength(1)
    search?: string
}
