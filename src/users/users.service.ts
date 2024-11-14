import { BadRequestException, Injectable } from '@nestjs/common'
import { RegisterDto } from './dto/register.dto'
import { ConfigService } from '@nestjs/config'
import { AuthService } from 'src/auth/auth.service'
import * as bcrypt from 'bcrypt'
import { UserMessages } from 'common/constants/messages/user.message'
import { LoginDto } from './dto/login.dto'
import { PointsService } from 'src/points/points.service'
import { UserRepository } from 'src/repositories/user.repository'

@Injectable()
export class UsersService {
    constructor(
        private usersRepository: UserRepository,
        private configService: ConfigService,
        private authService: AuthService,
        private pointService: PointsService
    ) {}

    // 1. Check email exists
    // 2. Hash password
    // 3. Save new user and point
    // 4. Generate token (access token, refresh token) taken from auth service
    // 5. Update refresh token and return token
    async register(registerDto: RegisterDto) {
        // 1
        const user = await this.usersRepository.findOneBy({ email: registerDto.email })
        if (user) throw new BadRequestException(UserMessages.EMAIL_ALREADY_EXISTS)

        // 2
        const hashedPassword = await bcrypt.hash(
            registerDto.password,
            +this.configService.get('AUTH_REGISTER_SALT_ROUNDS') || 10
        )

        // 3
        const newUser = await this.usersRepository.save({
            ...registerDto,
            password: hashedPassword
        })
        await this.pointService.createPoint({ userId: newUser.id })

        // 4
        const { accessToken, refreshToken } = await this.authService.generateToken({
            userId: newUser.id,
            role: newUser.role,
            verified: newUser.verified
        })

        // 5
        await this.usersRepository.update(newUser.id, {
            refreshToken
        })

        return { accessToken, refreshToken }
    }

    // 1. Check email exists
    // 2. Check password
    // 3. Check verified (handle in future)
    // 4. Generate token (access token, refresh token) taken from auth service
    // 5. Update new refresh token and return token
    async login(loginDto: LoginDto) {
        // 1
        const user = await this.usersRepository.findOneBy({ email: loginDto.email })
        if (!user) throw new BadRequestException(UserMessages.EMAIL_OR_PASSWORD_INVALID)

        // 2
        const isMatch = await bcrypt.compare(loginDto.password, user.password)
        if (!isMatch) throw new BadRequestException(UserMessages.EMAIL_OR_PASSWORD_INVALID)

        // 3 (coming soon)

        // 4
        const { accessToken, refreshToken } = await this.authService.generateToken({
            userId: user.id,
            role: user.role,
            verified: user.verified
        })

        // 5
        await this.usersRepository.update(user.id, {
            refreshToken
        })

        return { accessToken, refreshToken }
    }

    // Update refresh token is null
    async logout(userId: string) {
        await this.usersRepository.update(userId, { refreshToken: null })
    }
}
