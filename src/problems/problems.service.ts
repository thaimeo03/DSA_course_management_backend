import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Course } from 'database/entities/course.entity'
import { Problem } from 'database/entities/problem.entity'
import { Repository } from 'typeorm'
import { CreateProblemDto } from './dto/create-problem.dto'
import { CourseMessages } from 'common/constants/messages/course.message'
import * as _ from 'lodash'
import { ProblemMessages } from 'common/constants/messages/problem.message'
import { UpdateProblemDto } from './dto/update-problem.dto'

@Injectable()
export class ProblemsService {
    constructor(
        @InjectRepository(Problem) private problemRepository: Repository<Problem>,
        @InjectRepository(Course) private courseRepository: Repository<Course>
    ) {}

    // 1. Check course exists
    // 2. Save problem
    async createProblem(createProblemDto: CreateProblemDto) {
        // 1
        const course = await this.courseRepository.findOneBy({ id: createProblemDto.courseId })
        if (!course) throw new NotFoundException(CourseMessages.COURSE_NOT_FOUND)

        // 2
        const problem = await this.problemRepository.save({
            ...createProblemDto,
            course
        })

        return _.omit(problem, ['course'])
    }

    // 1. Check problem exists
    // 2. Delete problem
    async deleteProblem(id: string) {
        // 1
        const problem = await this.problemRepository.findOneBy({ id })
        if (!problem) throw new NotFoundException(ProblemMessages.PROBLEM_NOT_FOUND)

        // 2
        await this.problemRepository.delete(id)
    }

    // 1. Check problem exists
    // 2. Update problem
    async updateProblem(id: string, updateProblemDto: UpdateProblemDto) {
        // 1
        const problem = await this.problemRepository.findOneBy({ id })
        if (!problem) throw new NotFoundException(ProblemMessages.PROBLEM_NOT_FOUND)

        // 2
        await this.problemRepository.update(id, updateProblemDto)
    }
}
