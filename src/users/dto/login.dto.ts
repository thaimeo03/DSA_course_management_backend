import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string
}
