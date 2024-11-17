import { Injectable } from '@nestjs/common'
import { Problem } from 'database/entities/problem.entity'
import { FindOptionsOrder, FindOptionsWhere, ILike } from 'typeorm'
import { CreateProblemDto } from './dto/create-problem.dto'
import * as _ from 'lodash'
import { UpdateProblemDto } from './dto/update-problem.dto'
import { FindProblemsDto } from './dto/find-problems.dto'
import {
    FIND_PROBLEMS_LIMIT,
    FIND_PROBLEMS_PAGE
} from 'common/constants/constraints/problem.constraint'
import { Pagination } from 'common/core/pagination.core'
import { Order } from 'common/enums/index.enum'
import { SortBy } from 'common/enums/problems.enum'
import { CourseRepository } from 'src/repositories/course.repository'
import { ProblemRepository } from 'src/repositories/problem.repository'

@Injectable()
export class ProblemsService {
    constructor(
        private problemRepository: ProblemRepository,
        private courseRepository: CourseRepository
    ) {}

    // 1. Check course exists
    // 2. Save problem
    async createProblem(createProblemDto: CreateProblemDto) {
        // 1
        const course = await this.courseRepository.checkCourseExists({
            id: createProblemDto.courseId
        })

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
        await this.problemRepository.checkProblemExists({ id })

        // 2
        await this.problemRepository.delete(id)
    }

    // 1. Check problem exists
    // 2. Update problem
    async updateProblem(id: string, updateProblemDto: UpdateProblemDto) {
        // 1
        await this.problemRepository.checkProblemExists({ id })

        // 2
        await this.problemRepository.update(id, updateProblemDto)
    }

    // 1. Check course exists
    // 2. Add filters
    // 3. Find all problems
    // 4. Pagination
    async findProblemsByCourseId(courseId: string, findProblemsDto: FindProblemsDto) {
        // 1
        await this.courseRepository.checkCourseExists({ id: courseId })

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

    // 1. Check problem exists
    // 2. Toggle isActive field
    async toggleActiveProblem(id: string) {
        // 1
        const problem = await this.problemRepository.checkProblemExists({ id })

        // 2
        await this.problemRepository.update(id, { isActive: !problem.isActive })
    }
}
