import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from 'class-validator'

export class ApplyCouponDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    code: string

    @IsNotEmpty()
    @IsUUID()
    userId: string
}
