import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { User } from 'database/entities/user.entity'
import { AuthModule } from 'src/auth/auth.module'
import { PointsModule } from 'src/points/points.module'
import { RepositoriesModule } from 'src/repositories/repositories.module'
import { UserRepository } from 'src/repositories/user.repository'
import { ImagesModule } from 'src/images/images.module'

@Module({
    imports: [
        RepositoriesModule.register([User], [UserRepository]),
        AuthModule,
        PointsModule,
        ImagesModule
    ],
    controllers: [UsersController],
    providers: [UsersService]
})
export class UsersModule {}
