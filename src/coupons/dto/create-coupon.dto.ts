import { Transform } from 'class-transformer'
import {
    IsDate,
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    MaxLength,
    Min,
    MinDate,
    MinLength
} from 'class-validator'
import { CouponType } from 'common/enums/coupons.enum'

export class CreateCouponDto {
    @IsNotEmpty()
    @IsEnum(CouponType)
    type: CouponType

    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    code: string

    @IsOptional()
    @IsNumber()
    @Min(0)
    amountOff: number

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    percentOff: number

    @IsOptional()
    @IsNumber()
    @Min(0)
    maxRedeem: number

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    @MinDate(new Date())
    expiredAt?: Date
}
