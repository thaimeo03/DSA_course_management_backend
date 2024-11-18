import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { Strategy } from 'passport-jwt'
import { JwtPayloadDto } from '../dto/jwt-payload.dto'
import { UserRepository } from 'src/repositories/user.repository'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {
    constructor(private userRepository: UserRepository) {
        super({
            jwtFromRequest: RefreshTokenStrategy.extractJwtFromCookie,
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET
        })
    }

    private static extractJwtFromCookie(req: Request) {
        if (req.cookies && process.env.AUTH_COOKIE_REFRESH_TOKEN_NAME in req.cookies) {
            return req.cookies[process.env.AUTH_COOKIE_REFRESH_TOKEN_NAME]
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
