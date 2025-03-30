import {
    IsDateString,
    IsNotEmpty,
    IsNumberString,
    IsOptional,
    IsString,
    Length,
    MaxLength,
    MinLength
} from 'class-validator'

export class UpdateProfileDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    @IsOptional()
    fullName?: string

    @IsNumberString()
    @Length(10, 10)
    @IsOptional()
    phoneNumber?: string

    @IsDateString()
    @IsOptional()
    dateOfBirth?: Date

    @IsString()
    @IsOptional()
    avatar?: string
}
