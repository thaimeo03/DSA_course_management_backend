import { Module } from '@nestjs/common'
import { SubmissionsController } from './submissions.controller'
import { SubmissionsService } from './submissions.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Submission } from 'database/entities/submission.entity'
import { TestSuit } from 'database/entities/test-suit.entity'
import { User } from 'database/entities/user.entity'
import { SourceCodesModule } from 'src/source-codes/source-codes.module'
import { PointsModule } from 'src/points/points.module'
import { Problem } from 'database/entities/problem.entity'
import { CodeExecutorFactory } from './code-executor.factory'

@Module({
    imports: [
        TypeOrmModule.forFeature([Submission, TestSuit, User, Problem]),
        SourceCodesModule,
        PointsModule
    ],
    controllers: [SubmissionsController],
    providers: [SubmissionsService, CodeExecutorFactory]
})
export class SubmissionsModule {}
