import { Module } from '@nestjs/common'
import { ProblemsController } from './problems.controller'
import { ProblemsService } from './problems.service'
import { Problem } from 'database/entities/problem.entity'
import { Course } from 'database/entities/course.entity'
import { CourseRepository } from 'src/repositories/course.repository'
import { ProblemRepository } from 'src/repositories/problem.repository'
import { RepositoriesModule } from 'src/repositories/repositories.module'

@Module({
    imports: [
        RepositoriesModule.register([Problem, Course], [ProblemRepository, CourseRepository])
    ],
    controllers: [ProblemsController],
    providers: [ProblemsService]
})
export class ProblemsModule {}
