import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { RegisterDto } from './dto/register.dto'
import { ConfigService } from '@nestjs/config'
import { AuthService } from 'src/auth/auth.service'
import * as bcrypt from 'bcrypt'
import { UserMessages } from 'common/constants/messages/user.message'
import { LoginDto } from './dto/login.dto'
import { PointsService } from 'src/points/points.service'
import { UserRepository } from 'src/repositories/user.repository'
import Redis from 'ioredis'
import { RedisUtil } from 'common/utils/redis.util'

@Injectable()
export class UsersService {
    constructor(
        private usersRepository: UserRepository,
        private configService: ConfigService,
        private authService: AuthService,
        private pointService: PointsService,
        @Inject('REDIS_CLIENT') private readonly redisClient: Redis
    ) {}

    /**
     * Register a new user
     * @param registerDto The registration data
     * @returns An object containing the access token and refresh token
     * @throws BadRequestException if the email already exists
     */
    async register(
        registerDto: RegisterDto
    ): Promise<{ accessToken: string; refreshToken: string }> {
        // Check if the email already exists
        const existingUser = await this.usersRepository.findOneBy({ email: registerDto.email })
        if (existingUser) throw new BadRequestException(UserMessages.EMAIL_ALREADY_EXISTS)

        // Hash the password
        const hashedPassword = await bcrypt.hash(
            registerDto.password,
            +this.configService.get('AUTH_REGISTER_SALT_ROUNDS') || 10
        )

        // Save the new user and create a new point
        const newUser = await this.usersRepository.save({
            ...registerDto,
            password: hashedPassword
        })
        await this.pointService.createPoint({ userId: newUser.id })

        // Generate the access token and refresh token
        const { accessToken, refreshToken } = await this.authService.generateToken({
            userId: newUser.id,
            role: newUser.role,
            verified: newUser.verified
        })

        return { accessToken, refreshToken }
    }

    /**
     * Logs in a user by verifying credentials and generating tokens.
     * @param loginDto Login data transfer object containing email and password.
     * @returns An object containing the access token and refresh token.
     * @throws BadRequestException if the email or password is invalid.
     */
    async login(loginDto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
        // Check if the email exists in the database
        const user = await this.usersRepository.findOneBy({ email: loginDto.email })
        if (!user) throw new BadRequestException(UserMessages.EMAIL_OR_PASSWORD_INVALID)

        // Verify the password matches the stored hash
        const isMatch = await bcrypt.compare(loginDto.password, user.password)
        if (!isMatch) throw new BadRequestException(UserMessages.EMAIL_OR_PASSWORD_INVALID)

        // Check if the user is verified (to be implemented in the future)

        // Generate access and refresh tokens using the auth service
        const { accessToken, refreshToken } = await this.authService.generateToken({
            userId: user.id,
            role: user.role,
            verified: user.verified
        })

        // Return the generated tokens
        return { accessToken, refreshToken }
    }

    /**
     * Updates the user's refresh token to null, effectively logging them out.
     * @param userId The ID of the user to log out.
     * @returns A promise that resolves once the user's refresh token has been updated.
     */
    async logout(userId: string): Promise<void> {
        await this.redisClient.unlink(RedisUtil.getRefreshTokenKey(userId))
    }
}
