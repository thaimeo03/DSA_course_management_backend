import { Module } from '@nestjs/common'
import { SubmissionsController } from './submissions.controller'
import { SubmissionsService } from './submissions.service'
import { Submission } from 'database/entities/submission.entity'
import { TestSuit } from 'database/entities/test-suit.entity'
import { User } from 'database/entities/user.entity'
import { SourceCodesModule } from 'src/source-codes/source-codes.module'
import { PointsModule } from 'src/points/points.module'
import { Problem } from 'database/entities/problem.entity'
import { CodeExecutorFactory } from './code-executor.factory'
import { RepositoriesModule } from 'src/repositories/repositories.module'
import { SubmissionRepository } from 'src/repositories/submission.repository'
import { TestSuitRepository } from 'src/repositories/test-suit.repository'
import { UserRepository } from 'src/repositories/user.repository'
import { ProblemRepository } from 'src/repositories/problem.repository'

@Module({
    imports: [
        RepositoriesModule.register(
            [Submission, TestSuit, User, Problem],
            [SubmissionRepository, TestSuitRepository, UserRepository, ProblemRepository]
        ),
        SourceCodesModule,
        PointsModule
    ],
    controllers: [SubmissionsController],
    providers: [SubmissionsService, CodeExecutorFactory]
})
export class SubmissionsModule {}
