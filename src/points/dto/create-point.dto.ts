import { IsNotEmpty, IsNumber, IsOptional, IsUUID, Min } from 'class-validator'

export class CreatePointDto {
    @IsOptional()
    @IsNumber()
    @Min(0)
    value?: number // Default value is 0, set in entity

    @IsNotEmpty()
    @IsUUID()
    userId: string
}
