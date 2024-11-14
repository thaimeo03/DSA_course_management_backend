import { Module } from '@nestjs/common'
import { CoursesController } from './courses.controller'
import { CoursesService } from './courses.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Course } from 'database/entities/course.entity'
import { ImagesModule } from 'src/images/images.module'
import { Image } from 'database/entities/image.entity'
import { CourseRepository } from 'src/repositories/course.repository'
import { RepositoriesModule } from 'src/repositories/repositories.module'
import { ImageRepository } from 'src/repositories/image.repository'

@Module({
    imports: [
        RepositoriesModule.register([Course, Image], [CourseRepository, ImageRepository]),
        ImagesModule
    ],
    controllers: [CoursesController],
    providers: [CoursesService]
})
export class CoursesModule {}
