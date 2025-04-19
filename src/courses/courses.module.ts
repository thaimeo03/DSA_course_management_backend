import { Module } from '@nestjs/common'
import { CoursesController } from './courses.controller'
import { CoursesService } from './courses.service'
import { Course } from 'database/entities/course.entity'
import { ImagesModule } from 'src/images/images.module'
import { Repository } from 'database/entities/repository.entity'
import { CourseRepository } from 'src/repositories/course.repository'
import { RepositoriesModule } from 'src/repositories/repositories.module'
import { CloudRepository } from 'src/repositories/cloud.repository'
import { PaymentsModule } from 'src/payments/payments.module'

@Module({
    imports: [
        RepositoriesModule.register([Course, Repository], [CourseRepository, CloudRepository]),
        ImagesModule,
        PaymentsModule
    ],
    controllers: [CoursesController],
    providers: [CoursesService]
})
export class CoursesModule {}
