import { Module } from '@nestjs/common'
import { PointsService } from './points.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Point } from 'database/entities/point.entity'
import { User } from 'database/entities/user.entity'
import { PointsController } from './points.controller'
import { Submission } from 'database/entities/submission.entity'

@Module({
    imports: [TypeOrmModule.forFeature([Point, User, Submission])],
    controllers: [PointsController],
    providers: [PointsService],
    exports: [PointsService]
})
export class PointsModule {}
