import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsUUID, Min } from 'class-validator'
import { PaymentMethod } from 'common/enums/payment.enum'

export class PayDto {
    @IsNotEmpty()
    @IsUUID()
    courseId: string

    @IsNotEmpty()
    @IsEnum(PaymentMethod)
    method: PaymentMethod

    @IsOptional()
    @IsNumber()
    @Min(1)
    quantity?: number // Can be extended if needed
}
