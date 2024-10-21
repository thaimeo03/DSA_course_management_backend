import { Module } from '@nestjs/common'
import { SubmissionsController } from './submissions.controller'
import { SubmissionsService } from './submissions.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Submission } from 'database/entities/submission.entity'
import { TestSuit } from 'database/entities/test-suit.entity'
import { User } from 'database/entities/user.entity'

@Module({
    imports: [TypeOrmModule.forFeature([Submission, TestSuit, User])],
    controllers: [SubmissionsController],
    providers: [SubmissionsService]
})
export class SubmissionsModule {}
