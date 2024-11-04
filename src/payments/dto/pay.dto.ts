import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, Min, MinLength } from 'class-validator'
import { PaymentMethod } from 'common/enums/payment.enum'

export class PayDto {
    @IsNotEmpty()
    @IsUUID()
    courseId: string

    @IsNotEmpty()
    @IsEnum(PaymentMethod)
    method: PaymentMethod

    @IsOptional()
    @IsString()
    @MinLength(1)
    code?: string
}
