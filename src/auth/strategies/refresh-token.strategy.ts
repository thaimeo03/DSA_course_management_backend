import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'database/entities/user.entity'
import { Request } from 'express'
import { Strategy } from 'passport-jwt'
import { Repository } from 'typeorm'
import { JwtPayloadDto } from '../dto/jwt-payload.dto'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {
  @InjectRepository(User) private userRepository: Repository<User>

  constructor() {
    super({
      jwtFromRequest: RefreshTokenStrategy.extractJwtFromCookie,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET
    })
  }

  private static extractJwtFromCookie(req: Request) {
    if (req.cookies && 'refresh_token' in req.cookies) {
      return req.cookies.refresh_token
    }
    return null
  }

  async validate(payload: JwtPayloadDto) {
    const user = await this.userRepository.findOneBy({ id: payload.userId })

    if (!user) return null

    return {
      userId: user.id,
      role: user.role,
      verified: user.verified
    }
  }
}
