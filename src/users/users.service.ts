import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'database/entities/user.entity'
import { Repository } from 'typeorm'
import { RegisterDto } from './dto/register.dto'
import { ConfigService } from '@nestjs/config'
import { AuthService } from 'src/auth/auth.service'
import * as bcrypt from 'bcrypt'
import { UserMessages } from 'common/constants/messages/user.message'

@Injectable()
export class UsersService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private authService: AuthService
  ) {}

  // 1. Check email exists
  // 2. Hash password
  // 3. Create and save new user
  // 4. Generate token (access token, refresh token) taken from auth service
  // 5. Update refresh token and return token
  async register(registerDto: RegisterDto) {
    // 1
    const user = await this.usersRepository.findOneBy({ email: registerDto.email })
    if (user) throw new BadRequestException(UserMessages.EMAIL_ALREADY_EXISTS)

    // 2
    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      +this.configService.get('AUTH_REGISTER_SALT_ROUNDS') || 10
    )

    // 3
    const newUser = await this.usersRepository.save({
      ...registerDto,
      password: hashedPassword
    })

    // 4
    const { accessToken, refreshToken } = await this.authService.generateToken({
      userId: newUser.id,
      role: newUser.role,
      verified: newUser.verified
    })

    // 5
    await this.usersRepository.update(newUser.id, {
      refreshToken
    })

    return { accessToken, refreshToken }
  }

  // 1. Check email exists
  // 2. Check password
  // 3. Generate token (access token, refresh token) taken from auth service
  // 4. Update new refresh token and return token
  async login() {}

  async logout() {}
}
