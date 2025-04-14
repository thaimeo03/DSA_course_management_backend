import { IsEnum, IsOptional } from 'class-validator'
import { PaginationDto } from 'common/dto/pagination.dto'
import { SortBy } from 'common/enums/coupons.enum'
import { Order } from 'common/enums/index.enum'
import { Coupon } from 'database/entities/coupon.entity'
import { FindOptionsRelations, FindOptionsSelect, FindOptionsWhere } from 'typeorm'

export class GetAllCouponsDto extends PaginationDto {
    @IsOptional()
    @IsEnum(SortBy)
    sortBy?: SortBy

    @IsOptional()
    @IsEnum(Order)
    order?: Order
}

export class GetAllCouponsOptionDto {
    where?: FindOptionsWhere<Coupon> | FindOptionsWhere<Coupon>[]
    select?: FindOptionsSelect<Coupon>
    relations?: FindOptionsRelations<Coupon>
}
