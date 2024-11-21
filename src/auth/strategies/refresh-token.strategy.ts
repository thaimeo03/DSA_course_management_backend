import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { Strategy } from 'passport-jwt'
import { JwtPayloadDto } from '../dto/jwt-payload.dto'
import { UserRepository } from 'src/repositories/user.repository'

/**
 * Passport strategy for validating an refresh token sent in a cookie.
 */
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {
    constructor(private userRepository: UserRepository) {
        super({
            jwtFromRequest: RefreshTokenStrategy.extractJwtFromCookie,
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET
        })
    }

    /**
     * Extracts the refresh token from the request's cookies.
     * @param req - The incoming request object.
     * @returns The refresh token if it exists in the cookies; otherwise, null.
     */
    private static extractJwtFromCookie(req: Request) {
        if (req.cookies && process.env.AUTH_COOKIE_REFRESH_TOKEN_NAME in req.cookies) {
            return req.cookies[process.env.AUTH_COOKIE_REFRESH_TOKEN_NAME]
        }
        return null
    }

    /**
     * Validates the refresh token's payload and retrieves the associated user.
     * @param payload - The payload extracted from the refresh token.
     * @returns A promise that resolves to the user's payload if valid; otherwise, null.
     */
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
