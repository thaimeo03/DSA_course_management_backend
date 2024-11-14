import { Module } from '@nestjs/common'
import { LessonsController } from './lessons.controller'
import { LessonsService } from './lessons.service'
import { Course } from 'database/entities/course.entity'
import { Lesson } from 'database/entities/lesson.entity'
import { CourseRepository } from 'src/repositories/course.repository'
import { LessonRepository } from 'src/repositories/lesson.repository'
import { RepositoriesModule } from 'src/repositories/repositories.module'

@Module({
    imports: [RepositoriesModule.register([Course, Lesson], [CourseRepository, LessonRepository])],
    controllers: [LessonsController],
    providers: [LessonsService]
})
export class LessonsModule {}
