import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { RegisterDto } from './dto/register.dto'
import { Request, Response } from 'express'
import { DataResponse } from 'common/core/response-success.core'
import { UserMessages } from 'common/constants/messages/user.message'
import { ConfigService } from '@nestjs/config'
import { LoginDto } from './dto/login.dto'
import { AuthJwtGuard } from 'src/auth/guards/auth.guard'
import { Roles } from 'common/decorators/roles.de'
import { Role } from 'common/enums/users.enum'

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.usersService.register(registerDto)

    res.cookie(this.configService.get('AUTH_COOKIE_ACCESS_TOKEN_NAME'), accessToken, { httpOnly: true })
    res.cookie(this.configService.get('AUTH_COOKIE_REFRESH_TOKEN_NAME'), refreshToken, { httpOnly: true })

    return new DataResponse({ message: UserMessages.REGISTER_SUCCESS })
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.usersService.login(loginDto)

    res.cookie(this.configService.get('AUTH_COOKIE_ACCESS_TOKEN_NAME'), accessToken, { httpOnly: true })
    res.cookie(this.configService.get('AUTH_COOKIE_REFRESH_TOKEN_NAME'), refreshToken, { httpOnly: true })

    return new DataResponse({ message: UserMessages.LOGIN_SUCCESS })
  }

  @Get('logout')
  @UseGuards(AuthJwtGuard)
  @Roles(Role.Student)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return req.user
  }
}
