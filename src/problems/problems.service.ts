import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateProblemDto } from './dto/create-problem.dto'
import * as _ from 'lodash'
import { UpdateProblemDto } from './dto/update-problem.dto'
import { FindProblemsDto } from './dto/find-problems.dto'
import { CourseRepository } from 'src/repositories/course.repository'
import { ProblemRepository } from 'src/repositories/problem.repository'
import { ProblemMessages } from 'common/constants/messages/problem.message'
import { SubmissionStatus } from 'common/enums/submissions.enum'
import { Problem } from 'database/entities/problem.entity'

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
        const problem = await this.problemRepository.checkProblemExists({ id })
        if (problem.isActive)
            throw new BadRequestException(ProblemMessages.CAN_NOT_DELETE_ACTIVE_PROBLEM)

        // 2
        await this.problemRepository.delete(id)
    }

    // 1. Check problem exists
    // 2. Update problem
    async updateProblem(id: string, updateProblemDto: UpdateProblemDto) {
        // 1
        const problem = await this.problemRepository.checkProblemExists({ id })
        if (problem.isActive)
            throw new BadRequestException(ProblemMessages.CAN_NOT_UPDATE_ACTIVE_PROBLEM)

        // 2
        await this.problemRepository.update(id, updateProblemDto)
    }

    // 1. Check course exists
    // 2. Find all problems
    async findProblemsByCourseId(courseId: string, findProblemsDto: FindProblemsDto) {
        // 1
        await this.courseRepository.checkCourseExists({ id: courseId })

        // 2
        return this.problemRepository.findProblemsByCourseId(courseId, findProblemsDto)
    }

    // 1. Check course exists
    // 2. Find all problems
    async findActiveProblemsByCourseId(
        courseId: string,
        userId: string,
        findProblemsDto: FindProblemsDto
    ) {
        // 1
        await this.courseRepository.checkCourseExists({ id: courseId })

        // 2
        const data = await this.problemRepository.findProblemsByCourseId(
            courseId,
            findProblemsDto,
            {
                relations: {
                    submissions: {
                        user: true
                    }
                },
                where: {
                    isActive: true
                }
            }
        )

        data.problems = data.problems.map((problem) => {
            let problemWithStatus
            if (problem.submissions.length === 0) {
                problemWithStatus = {
                    ...problem,
                    status: SubmissionStatus.Todo
                }
            } else {
                const isPassed = problem.submissions.some(
                    (submission) =>
                        submission.user.id === userId &&
                        submission.status === SubmissionStatus.Passed
                )

                if (isPassed) {
                    problemWithStatus = {
                        ...problem,
                        status: SubmissionStatus.Passed
                    }
                } else {
                    problemWithStatus = {
                        ...problem,
                        status: SubmissionStatus.Failed
                    }
                }
            }

            return _.omit(problemWithStatus, ['submissions'])
        }) as Problem[]

        return data
    }

    // 1. Check problem exists
    // 2. Update isActive field = true
    async activeProblem(id: string) {
        // 1
        const problem = await this.problemRepository.checkProblemExists({ id })
        if (problem.isActive) return

        // 2
        await this.problemRepository.update(id, { isActive: true })
    }

    // 1. Check problem exists
    // 2. Update isActive field = false
    async inactiveProblem(id: string) {
        // 1
        const problem = await this.problemRepository.checkProblemExists({ id })
        if (!problem.isActive) return

        // 2
        await this.problemRepository.update(id, { isActive: false })
    }

    // 1. Find problem
    // 2. Update isArchived field = true
    async archiveProblem(id: string) {
        // 1
        const problem = await this.problemRepository.findOneBy({ id })
        if (!problem) throw new BadRequestException(ProblemMessages.PROBLEM_NOT_FOUND)
        if (problem.isArchived) return

        // 2
        await this.problemRepository.update(id, { isArchived: true })
    }

    // 1. Find problem
    // 2. Update isArchived field = false
    async unarchiveProblem(id: string) {
        // 1
        const problem = await this.problemRepository.findOneBy({ id })
        if (!problem) throw new BadRequestException(ProblemMessages.PROBLEM_NOT_FOUND)
        if (!problem.isArchived) return

        // 2
        await this.problemRepository.update(id, { isArchived: false })
    }
}
