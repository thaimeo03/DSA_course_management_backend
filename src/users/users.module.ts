import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'database/entities/user.entity'
import { AuthModule } from 'src/auth/auth.module'
import { PointsModule } from 'src/points/points.module'

@Module({
    imports: [TypeOrmModule.forFeature([User]), AuthModule, PointsModule],
    controllers: [UsersController],
    providers: [UsersService]
})
export class UsersModule {}
