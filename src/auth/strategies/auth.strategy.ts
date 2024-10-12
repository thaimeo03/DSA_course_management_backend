import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'database/entities/user.entity'
import { Request } from 'express'
import { Strategy } from 'passport-jwt'
import { Repository } from 'typeorm'
import { JwtPayloadDto } from '../dto/jwt-payload.dto'
import { PayloadDto } from '../dto/payload.dto'

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy, 'authJwt') {
    @InjectRepository(User) private userRepository: Repository<User>

    constructor() {
        super({
            jwtFromRequest: AuthJwtStrategy.extractJwtFromCookie,
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET
        })
    }

    private static extractJwtFromCookie(req: Request) {
        if (req.cookies && process.env.AUTH_COOKIE_ACCESS_TOKEN_NAME in req.cookies) {
            return req.cookies[process.env.AUTH_COOKIE_ACCESS_TOKEN_NAME]
        }
        return null
    }

    async validate(payload: JwtPayloadDto): Promise<PayloadDto> {
        const user = await this.userRepository.findOneBy({ id: payload.userId })

        if (!user) return null

        return {
            userId: user.id,
            role: user.role,
            verified: user.verified
        }
    }
}
