import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'database/entities/user.entity'
import { JwtModule } from '@nestjs/jwt'
import { AuthJwtStrategy } from './strategies/auth.strategy'

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule],
  providers: [AuthService, AuthJwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
