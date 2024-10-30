import { Module } from '@nestjs/common'
import { PointsService } from './points.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Point } from 'database/entities/point.entity'
import { User } from 'database/entities/user.entity'
import { PointsController } from './points.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Point, User])],
    providers: [PointsService],
    exports: [PointsService],
    controllers: [PointsController]
})
export class PointsModule {}
