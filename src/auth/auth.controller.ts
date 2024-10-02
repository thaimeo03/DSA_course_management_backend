import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Request, Response } from 'express'
import { DataResponse } from 'common/core/response-success.core'
import { ConfigService } from '@nestjs/config'
import { AuthMessages } from 'common/constants/messages/auth.message'
import { RefreshTokenGuard } from './guards/refresh-token.guard'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Get('refresh-token')
  @UseGuards(RefreshTokenGuard)
  async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const userId = req.user['userId'] as string
    const oldRefreshToken = req.cookies.refresh_token as string

    const { accessToken, refreshToken } = await this.authService.refreshToken({ userId, oldRefreshToken })

    res.cookie(this.configService.get('AUTH_COOKIE_ACCESS_TOKEN_NAME'), accessToken, { httpOnly: true })
    res.cookie(this.configService.get('AUTH_COOKIE_REFRESH_TOKEN_NAME'), refreshToken, { httpOnly: true })

    return new DataResponse({ message: AuthMessages.REFRESH_TOKEN_SUCCESS })
  }
}
