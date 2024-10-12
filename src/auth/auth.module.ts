import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'database/entities/user.entity'
import { JwtModule } from '@nestjs/jwt'
import { AuthJwtStrategy } from './strategies/auth.strategy'
import { AuthController } from './auth.controller'
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy'

@Module({
    imports: [TypeOrmModule.forFeature([User]), JwtModule],
    providers: [AuthService, AuthJwtStrategy, RefreshTokenStrategy],
    exports: [AuthService],
    controllers: [AuthController]
})
export class AuthModule {}
