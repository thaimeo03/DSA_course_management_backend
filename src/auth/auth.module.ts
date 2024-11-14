import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { User } from 'database/entities/user.entity'
import { JwtModule } from '@nestjs/jwt'
import { AuthJwtStrategy } from './strategies/auth.strategy'
import { AuthController } from './auth.controller'
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy'
import { RepositoriesModule } from 'src/repositories/repositories.module'
import { UserRepository } from 'src/repositories/user.repository'

@Module({
    imports: [RepositoriesModule.register([User], [UserRepository]), JwtModule],
    providers: [AuthService, AuthJwtStrategy, RefreshTokenStrategy],
    exports: [AuthService],
    controllers: [AuthController]
})
export class AuthModule {}
