import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'database/entities/user.entity'
import { Repository } from 'typeorm'
import { PayloadDto } from './dto/payload.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { AuthMessages } from 'common/constants/messages/auth.message'

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_TOKEN_TYPE = 'ACCESS_TOKEN'
  private readonly JWT_REFRESH_TOKEN_TYPE = 'REFRESH_TOKEN'

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  async generateToken(payloadDto: PayloadDto) {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payloadDto),
      this.generateRefreshToken(payloadDto)
    ])

    return { accessToken, refreshToken }
  }

  async generateAccessToken(payloadDto: PayloadDto) {
    return await this.jwtService.signAsync(
      {
        ...payloadDto,
        type: this.JWT_ACCESS_TOKEN_TYPE
      },
      {
        expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRE'),
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET')
      }
    )
  }

  async generateRefreshToken(payloadDto: PayloadDto) {
    return await this.jwtService.signAsync(
      {
        ...payloadDto,
        type: this.JWT_REFRESH_TOKEN_TYPE
      },
      {
        expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE'),
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET')
      }
    )
  }

  // 1. Check old refresh token
  // 2. Generate new access token
  // 3. Update new refresh token
  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    // 1
    const { userId, oldRefreshToken } = refreshTokenDto
    const user = await this.userRepository.findOneBy({ id: userId })

    if (oldRefreshToken !== user.refreshToken) throw new BadRequestException(AuthMessages.INVALID_TOKEN)

    // 2
    const { accessToken, refreshToken } = await this.generateToken({
      userId,
      role: user.role,
      verified: user.verified
    })

    // 3
    await this.userRepository.update(userId, { refreshToken })

    return { accessToken, refreshToken }
  }
}
