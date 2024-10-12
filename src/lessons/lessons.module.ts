import { Module } from '@nestjs/common'
import { LessonsController } from './lessons.controller'
import { LessonsService } from './lessons.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Course } from 'database/entities/course.entity'
import { Lesson } from 'database/entities/lesson.entity'

@Module({
    imports: [TypeOrmModule.forFeature([Lesson, Course])],
    controllers: [LessonsController],
    providers: [LessonsService]
})
export class LessonsModule {}
