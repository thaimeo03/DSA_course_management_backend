import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { PayloadDto } from './dto/payload.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { AuthMessages } from 'common/constants/messages/auth.message'
import { UserRepository } from 'src/repositories/user.repository'

@Injectable()
export class AuthService {
    private readonly JWT_ACCESS_TOKEN_TYPE = 'ACCESS_TOKEN'
    private readonly JWT_REFRESH_TOKEN_TYPE = 'REFRESH_TOKEN'

    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
        private userRepository: UserRepository
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
     * Generates a refresh token for the given payload.
     * @param payloadDto - The payload data transfer object containing user details.
     * @returns A promise that resolves to the generated refresh token.
     */
    async generateRefreshToken(payloadDto: PayloadDto): Promise<string> {
        // Signing the refresh token with user payload and specific JWT type
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

    /**
     * Refreshes the access token for the given user, with the given old refresh token.
     * @param refreshTokenDto - The data transfer object containing the user ID and the old refresh token.
     * @returns A promise that resolves to an object containing the new access token and the new refresh token.
     */
    async refreshToken(
        refreshTokenDto: RefreshTokenDto
    ): Promise<{ accessToken: string; refreshToken: string }> {
        // Check old refresh token
        const { userId, oldRefreshToken } = refreshTokenDto
        const user = await this.userRepository.findOneBy({ id: userId })

        if (oldRefreshToken !== user.refreshToken)
            throw new BadRequestException(AuthMessages.INVALID_TOKEN)

        // Generate new access token
        const { accessToken, refreshToken } = await this.generateToken({
            userId,
            role: user.role,
            verified: user.verified
        })

        // Update new refresh token
        await this.userRepository.update(userId, { refreshToken })

        return { accessToken, refreshToken }
    }
}
