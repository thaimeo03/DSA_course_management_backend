import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { PayloadDto } from './dto/payload.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { AuthMessages } from 'common/constants/messages/auth.message'
import { UserRepository } from 'src/repositories/user.repository'
import Redis from 'ioredis'
import { RedisUtil } from 'common/utils/redis.util'

@Injectable()
export class AuthService {
    private readonly JWT_ACCESS_TOKEN_TYPE = 'ACCESS_TOKEN'
    private readonly JWT_REFRESH_TOKEN_TYPE = 'REFRESH_TOKEN'

    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
        private userRepository: UserRepository,
        @Inject('REDIS_CLIENT') private readonly redisClient: Redis
    ) {}

    /**
     * Generates both access and refresh tokens based on the provided payload.
     * @param payloadDto - The payload data transfer object containing user details.
     * @returns An object containing the generated access and refresh tokens.
     */
    async generateToken(payloadDto: PayloadDto) {
        // Generate access and refresh tokens concurrently
        const [accessToken, refreshToken] = await Promise.all([
            this.generateAccessToken(payloadDto),
            this.generateRefreshToken(payloadDto)
        ])

        // Return the tokens in an object
        return { accessToken, refreshToken }
    }

    /**
     * Generates an access token for the given payload.
     * @param payloadDto - The payload data transfer object containing user details.
     * @returns A promise that resolves to the generated access token.
     */
    async generateAccessToken(payloadDto: PayloadDto): Promise<string> {
        // Signing the access token with user payload and specific JWT type
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

    /**
     * Generates a refresh token for the given payload and stores it in Redis.
     * @param payloadDto - The payload data transfer object containing user details.
     * @returns A promise that resolves to the generated refresh token.
     */
    async generateRefreshToken(payloadDto: PayloadDto): Promise<string> {
        // Signing the refresh token with user payload and specific JWT type
        const refreshToken = await this.jwtService.signAsync(
            {
                ...payloadDto,
                type: this.JWT_REFRESH_TOKEN_TYPE
            },
            {
                expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE'),
                secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET')
            }
        )

        // Store the refresh token in Redis
        await this.storeRefreshTokenToRedis(payloadDto.userId, refreshToken)

        return refreshToken
    }

    /**
     * Refreshes the access token for the given user, with the given old refresh token.
     * @param refreshTokenDto - The data transfer object containing the user ID and the old refresh token.
     * @returns A promise that resolves to an object containing the new access token and the new refresh token.
     */
    async refreshToken(
        refreshTokenDto: RefreshTokenDto
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const { userId, oldRefreshToken } = refreshTokenDto
        const user = await this.userRepository.findOneBy({ id: userId })

        // Get the refresh token from Redis
        const redisRefreshToken = await this.redisClient.get(RedisUtil.getRefreshTokenKey(userId))

        // Check is matching refresh token
        if (oldRefreshToken !== redisRefreshToken)
            throw new BadRequestException(AuthMessages.INVALID_TOKEN)

        // Generate new access token
        const { accessToken, refreshToken } = await this.generateToken({
            userId,
            role: user.role,
            verified: user.verified
        })

        return { accessToken, refreshToken }
    }

    /**
     * Stores the refresh token in Redis with an expiry time.
     * @param userId - The ID of the user to associate with the refresh token.
     * @param refreshToken - The refresh token to be stored.
     * @returns A promise that resolves once the refresh token is stored in Redis.
     */
    async storeRefreshTokenToRedis(userId: string, refreshToken: string) {
        // Get the refresh token expiry duration (e.g., '30d')
        const refreshTokenExpire = this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE')

        // Convert the expiry duration from days to seconds
        const refreshTokenExpireTime = +refreshTokenExpire.slice(0, -1) * 24 * 60 * 60

        // Store the refresh token in Redis with the calculated expiration time
        return this.redisClient.set(
            RedisUtil.getRefreshTokenKey(userId),
            refreshToken,
            'EX',
            refreshTokenExpireTime
        )
    }
}
