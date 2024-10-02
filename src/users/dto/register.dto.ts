import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'
import { IsMatch } from 'common/decorators/validation.de'

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  fullName: string

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @IsMatch('password', { message: 'Password do not match' })
  confirmPassword: string
}
