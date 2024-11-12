import { Module } from '@nestjs/common'
import { ProblemsController } from './problems.controller'
import { ProblemsService } from './problems.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Problem } from 'database/entities/problem.entity'
import { Course } from 'database/entities/course.entity'
import { CourseRepository } from 'src/repositories/course.repository'
import { ProblemRepository } from 'src/repositories/problem.repository'

@Module({
    imports: [TypeOrmModule.forFeature([Problem, Course])],
    controllers: [ProblemsController],
    providers: [ProblemsService, ProblemRepository, CourseRepository]
})
export class ProblemsModule {}
