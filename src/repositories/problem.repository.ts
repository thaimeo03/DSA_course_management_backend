import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
    FIND_PROBLEMS_LIMIT,
    FIND_PROBLEMS_PAGE
} from 'common/constants/constraints/problem.constraint'
import { ProblemMessages } from 'common/constants/messages/problem.message'
import { Pagination } from 'common/core/pagination.core'
import { Order } from 'common/enums/index.enum'
import { SortBy } from 'common/enums/problems.enum'
import { Problem } from 'database/entities/problem.entity'
import { FindProblemsDto } from 'src/problems/dto/find-problems.dto'
import {
    FindOptionsOrder,
    FindOptionsRelations,
    FindOptionsWhere,
    ILike,
    Repository
} from 'typeorm'
import * as _ from 'lodash'
import { FindProblemOptionDto } from 'src/problems/dto/find-problem-option.dto'

@Injectable()
export class ProblemRepository extends Repository<Problem> {
    constructor(@InjectRepository(Problem) private problemRepository: Repository<Problem>) {
        super(problemRepository.target, problemRepository.manager, problemRepository.queryRunner)
    }

    // 1. Check problem exists
    // 2. Return problem
    async checkProblemExists(where: FindOptionsWhere<Problem> | FindOptionsWhere<Problem>[]) {
        // 1
        const problem = await this.problemRepository.findOneBy(where)
        if (!problem) throw new NotFoundException(ProblemMessages.PROBLEM_NOT_FOUND)
        if (problem.isArchived) throw new NotFoundException(ProblemMessages.PROBLEM_ARCHIVED)

        // 2
        return problem
    }

    // 1. Add filters
    // 2. Find all problems
    // 3. Pagination
    async findProblemsByCourseId(
        courseId: string,
        findProblemsDto: FindProblemsDto,
        options?: FindProblemOptionDto
    ) {
        // 1
        const page = findProblemsDto.page || FIND_PROBLEMS_PAGE
        const limit = findProblemsDto.limit || FIND_PROBLEMS_LIMIT
        const skip = (page - 1) * limit
        const where: FindOptionsWhere<Problem> | FindOptionsWhere<Problem>[] = {
            title: findProblemsDto.search ? ILike(`%${findProblemsDto.search}%`) : undefined,
            course: {
                id: courseId
            },
            isArchived: false,
            ...options?.where
        }
        const select = options?.select

        const order: FindOptionsOrder<Problem> = {
            [findProblemsDto.sortBy || SortBy.CreatedAt]: findProblemsDto.order || Order.Asc
        }

        const relations: FindOptionsRelations<Problem> = options?.relations

        // 2
        const problems = await this.problemRepository.find({
            relations,
            where: _.omitBy(where, _.isUndefined), // remove undefined values
            skip,
            take: limit,
            order: order,
            select
        })

        // 3
        const totalCount = await this.problemRepository.count({ where })
        const totalPage = Math.ceil(totalCount / limit)
        const pagination = new Pagination({
            limit,
            currentPage: page,
            totalPage,
            totalElements: totalCount
        })

        return {
            problems,
            pagination
        }
    }
}
