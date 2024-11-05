import { Transform } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator'

export class CallbackDto {
    @IsNotEmpty()
    @IsUUID()
    paymentId: string

    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    success: number
}
