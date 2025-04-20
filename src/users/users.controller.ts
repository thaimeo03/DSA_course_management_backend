import { Body, Controller, Get, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { RegisterDto } from './dto/register.dto'
import { Request, Response } from 'express'
import { DataResponse, DataResponseWithPagination } from 'common/core/response-success.core'
import { UserMessages } from 'common/constants/messages/user.message'
import { ConfigService } from '@nestjs/config'
import { LoginDto } from './dto/login.dto'
import { AuthJwtGuard } from 'src/auth/guards/auth.guard'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { GetRanksDto } from './dto/get-ranks.dto'
import { Roles } from 'common/decorators/roles.de'
import { Role } from 'common/enums/users.enum'
import { GetAccountsDto } from './dto/get-accounts.dto'

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService
    ) {}

    @Post('register')
    async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) res: Response) {
        const { accessToken, refreshToken } = await this.usersService.register(registerDto)

        res.cookie(this.configService.get('AUTH_COOKIE_ACCESS_TOKEN_NAME'), accessToken, {
            httpOnly: true
        })
        res.cookie(this.configService.get('AUTH_COOKIE_REFRESH_TOKEN_NAME'), refreshToken, {
            httpOnly: true
        })

        return new DataResponse({ message: UserMessages.REGISTER_SUCCESS })
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const { accessToken, refreshToken } = await this.usersService.login(loginDto)

        res.cookie(this.configService.get('AUTH_COOKIE_ACCESS_TOKEN_NAME'), accessToken, {
            httpOnly: true
        })
        res.cookie(this.configService.get('AUTH_COOKIE_REFRESH_TOKEN_NAME'), refreshToken, {
            httpOnly: true
        })

        return new DataResponse({ message: UserMessages.LOGIN_SUCCESS })
    }

    @Get('logout')
    @UseGuards(AuthJwtGuard)
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const userId = req.user['userId'] as string

        await this.usersService.logout(userId)

        // Clear cookies
        res.clearCookie(this.configService.get('AUTH_COOKIE_ACCESS_TOKEN_NAME'))
        res.clearCookie(this.configService.get('AUTH_COOKIE_REFRESH_TOKEN_NAME'))

        return new DataResponse({ message: UserMessages.LOGOUT_SUCCESS })
    }

    @Get('me')
    @UseGuards(AuthJwtGuard)
    async getMe(@Req() req: Request) {
        const userId = req.user['userId'] as string

        const data = await this.usersService.getMe(userId)

        return new DataResponse({
            message: UserMessages.GET_ME_SUCCESS,
            data
        })
    }

    @Patch('update/profile')
    @UseGuards(AuthJwtGuard)
    async updateProfile(@Req() req: Request, @Body() updateProfileDto: UpdateProfileDto) {
        const userId = req.user['userId'] as string
        const data = await this.usersService.updateProfile(userId, updateProfileDto)

        return new DataResponse({
            message: UserMessages.UPDATE_PROFILE_SUCCESS,
            data
        })
    }

    @Get('ranks')
    async getRanks(@Query() getRanksQuery: GetRanksDto) {
        const { ranks, pagination } = await this.usersService.getRanks(getRanksQuery)

        return new DataResponseWithPagination({
            message: UserMessages.GET_RANKS_SUCCESS,
            data: ranks,
            pagination
        })
    }

    @Get('accounts')
    @UseGuards(AuthJwtGuard)
    @Roles(Role.Admin)
    async getAccounts(@Query() getAccountsDto: GetAccountsDto) {
        const { accounts, pagination } = await this.usersService.getAccounts(getAccountsDto)

        return new DataResponseWithPagination({
            message: UserMessages.GET_ACCOUNTS_SUCCESS,
            data: accounts,
            pagination
        })
    }
}
