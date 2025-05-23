import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common'
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
import { UpdateProfileDto } from './dto/update-profile.dto'
import { ImagesService } from 'src/images/images.service'
import { GetRanksDto } from './dto/get-ranks.dto'
import { HavePagination } from 'common/enums/index.enum'
import { Pagination } from 'common/core/pagination.core'
import { GetAccountsDto } from './dto/get-accounts.dto'

@Injectable()
export class UsersService {
    constructor(
        private usersRepository: UserRepository,
        private configService: ConfigService,
        private authService: AuthService,
        private pointService: PointsService,
        private imageService: ImagesService,
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

    async getMe(userId: string) {
        const user = await this.usersRepository.findOne({
            where: {
                id: userId
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                phoneNumber: true,
                avatar: true,
                verified: true,
                dateOfBirth: true
            }
        })

        if (!user) throw new NotFoundException(UserMessages.USER_NOT_FOUND)

        return user
    }

    async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
        const user = await this.usersRepository.findOneBy({ id: userId })
        if (!user) throw new NotFoundException(UserMessages.USER_NOT_FOUND)

        const { avatar } = updateProfileDto

        // If the avatar is provided, implement the logic to upload it to cloudinary and get the URL and delete the old avatar
        if (avatar) {
            try {
                await this.imageService.deleteImages([user.avatar])
            } catch (error) {
                throw new InternalServerErrorException(error)
            }
        }

        await this.usersRepository.update({ id: userId }, { ...updateProfileDto })
    }

    async getRanks(getRanksQuery: GetRanksDto) {
        const limit = getRanksQuery.limit || 20
        const page = getRanksQuery.page || 1
        const havePagination = getRanksQuery.paging || HavePagination.Y

        // Get the ranks from Redis
        const start = (page - 1) * limit
        const end = havePagination ? page * limit - 1 : -1
        const ranksWithScores = await this.redisClient.zrevrange(
            RedisUtil.getRanksKey(),
            start,
            end,
            'WITHSCORES'
        )

        // Transform the ranks and scores
        const ranks = []
        for (let i = 0; i < ranksWithScores.length; i += 2) {
            const userId = ranksWithScores[i]
            const score = +ranksWithScores[i + 1]

            const user = await this.usersRepository.findOne({
                where: { id: userId },
                select: {
                    id: true,
                    fullName: true,
                    avatar: true
                }
            })

            if (user) {
                ranks.push({
                    rank: Math.floor(i / 2) + 1,
                    user,
                    score
                })
            }
        }

        const pagination = new Pagination({
            limit,
            currentPage: page,
            totalPage: Math.ceil(ranks.length / limit),
            totalElements: ranks.length
        })

        return {
            ranks,
            pagination
        }
    }

    /**
     * Gets a list of user accounts with pagination, sorting, and filtering.
     * @param getAccountsDto - The data to filter, sort and paginate the accounts.
     * @returns An object containing the list of accounts and pagination details.
     */
    async getAccounts(getAccountsDto: GetAccountsDto) {
        return this.usersRepository.getAccounts(getAccountsDto, {
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                phoneNumber: true,
                avatar: true,
                verified: true,
                dateOfBirth: true,
                createdAt: true,
                updatedAt: true
            }
        })
    }
}
