import { Module } from '@nestjs/common'
import { CoursesController } from './courses.controller'
import { CoursesService } from './courses.service'
import { Course } from 'database/entities/course.entity'
import { ImagesModule } from 'src/images/images.module'
import { Image } from 'database/entities/image.entity'
import { CourseRepository } from 'src/repositories/course.repository'
import { RepositoriesModule } from 'src/repositories/repositories.module'
import { ImageRepository } from 'src/repositories/image.repository'
import { PaymentsModule } from 'src/payments/payments.module'

@Module({
    imports: [
        RepositoriesModule.register([Course, Image], [CourseRepository, ImageRepository]),
        ImagesModule,
        PaymentsModule
    ],
    controllers: [CoursesController],
    providers: [CoursesService]
})
export class CoursesModule {}
