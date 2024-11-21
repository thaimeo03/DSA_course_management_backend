import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { Strategy } from 'passport-jwt'
import { JwtPayloadDto } from '../dto/jwt-payload.dto'
import { PayloadDto } from '../dto/payload.dto'
import { UserRepository } from 'src/repositories/user.repository'

/**
 * Passport strategy for validating an access token sent in a cookie.
 */
@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy, 'authJwt') {
    constructor(private userRepository: UserRepository) {
        super({
            jwtFromRequest: AuthJwtStrategy.extractJwtFromCookie,
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET
        })
    }

    /**
     * Extracts the access token from the request's cookie.
     * @param req - The request.
     * @returns The access token if it exists in the cookie.
     */
    private static extractJwtFromCookie(req: Request) {
        if (req.cookies && process.env.AUTH_COOKIE_ACCESS_TOKEN_NAME in req.cookies) {
            return req.cookies[process.env.AUTH_COOKIE_ACCESS_TOKEN_NAME]
        }
        return null
    }

    /**
     * Validates the access token and returns the user's payload if it is valid.
     * @param payload - The payload of the access token.
     * @returns The user's payload if the access token is valid.
     */
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
