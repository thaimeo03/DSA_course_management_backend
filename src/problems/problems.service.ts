import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Course } from 'database/entities/course.entity'
import { Problem } from 'database/entities/problem.entity'
import { FindOptionsOrder, FindOptionsWhere, ILike, Repository } from 'typeorm'
import { CreateProblemDto } from './dto/create-problem.dto'
import { CourseMessages } from 'common/constants/messages/course.message'
import * as _ from 'lodash'
import { ProblemMessages } from 'common/constants/messages/problem.message'
import { UpdateProblemDto } from './dto/update-problem.dto'
import { FindProblemsDto } from './dto/find-problems.dto'
import {
    FIND_PROBLEMS_LIMIT,
    FIND_PROBLEMS_PAGE
} from 'common/constants/constraints/problem.constraint'
import { Pagination } from 'common/core/pagination.core'
import { Order } from 'common/enums/index.enum'
import { SortBy } from 'common/enums/problems.enum'

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

    // 1. Check course exists
    // 2. Add filters
    // 3. Find all problems
    // 4. Pagination
    async findProblemsByCourseId(courseId: string, findProblemsDto: FindProblemsDto) {
        // 1
        const course = await this.courseRepository.findOneBy({ id: courseId })
        if (!course) throw new NotFoundException(CourseMessages.COURSE_NOT_FOUND)

        // 2
        const page = findProblemsDto.page || FIND_PROBLEMS_PAGE
        const limit = findProblemsDto.limit || FIND_PROBLEMS_LIMIT
        const skip = (page - 1) * limit
        const where: FindOptionsWhere<Problem> | FindOptionsWhere<Problem>[] = {
            title: findProblemsDto.search ? ILike(`%${findProblemsDto.search}%`) : undefined,
            course: {
                id: courseId
            }
        }

        const order: FindOptionsOrder<Problem> = {
            [findProblemsDto.sortBy || SortBy.CreatedAt]: findProblemsDto.order || Order.Asc
        }

        // 3
        const problems = await this.problemRepository.find({
            where: _.omitBy(where, _.isUndefined), // remove undefined values
            skip,
            take: limit,
            order: order
        })

        // 4
        const totalPage = Math.ceil((await this.problemRepository.count({ where })) / limit)
        const pagination = new Pagination({ limit, currentPage: page, totalPage })

        return {
            problems,
            pagination
        }
    }
}
