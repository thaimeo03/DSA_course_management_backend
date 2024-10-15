import { Module } from '@nestjs/common'
import { ProblemsController } from './problems.controller'
import { ProblemsService } from './problems.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Problem } from 'database/entities/problem.entity'
import { Course } from 'database/entities/course.entity'

@Module({
    imports: [TypeOrmModule.forFeature([Problem, Course])],
    controllers: [ProblemsController],
    providers: [ProblemsService]
})
export class ProblemsModule {}
