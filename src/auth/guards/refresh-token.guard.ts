import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

/**
 * A guard that uses the 'refresh-token' strategy to protect routes.
 *
 * @extends AuthGuard
 */
@Injectable()
export class RefreshTokenGuard extends AuthGuard('refresh-token') {}
