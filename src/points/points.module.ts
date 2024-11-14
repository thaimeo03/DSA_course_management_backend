import { Module } from '@nestjs/common'
import { PointsService } from './points.service'
import { Point } from 'database/entities/point.entity'
import { User } from 'database/entities/user.entity'
import { PointsController } from './points.controller'
import { Submission } from 'database/entities/submission.entity'
import { RepositoriesModule } from 'src/repositories/repositories.module'
import { PointRepository } from 'src/repositories/point.repository'
import { UserRepository } from 'src/repositories/user.repository'
import { SubmissionRepository } from 'src/repositories/submission.repository'

@Module({
    imports: [
        RepositoriesModule.register(
            [Point, User, Submission],
            [PointRepository, UserRepository, SubmissionRepository]
        )
    ],
    controllers: [PointsController],
    providers: [PointsService],
    exports: [PointsService]
})
export class PointsModule {}
