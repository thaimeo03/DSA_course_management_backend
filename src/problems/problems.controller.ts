import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ProblemsService } from './problems.service'
import { CreateProblemDto } from './dto/create-problem.dto'
import { ProblemMessages } from 'common/constants/messages/problem.message'
import { DataResponse, DataResponseWithPagination } from 'common/core/response-success.core'
import { UpdateProblemDto } from './dto/update-problem.dto'
import { FindProblemsDto } from './dto/find-problems.dto'

@Controller('problems')
export class ProblemsController {
    constructor(private readonly problemsService: ProblemsService) {}

    @Post()
    async createProblem(@Body() createProblemDto: CreateProblemDto) {
        const data = await this.problemsService.createProblem(createProblemDto)

        return new DataResponse({ message: ProblemMessages.CREATE_PROBLEM_SUCCESS, data })
    }

    @Get('/course/:courseId')
    async findProblemsByCourseId(
        @Param('courseId') courseId: string,
        @Query() findProblemsDto: FindProblemsDto
    ) {
        const { problems, pagination } = await this.problemsService.findProblemsByCourseId(
            courseId,
            findProblemsDto
        )

        return new DataResponseWithPagination({
            message: ProblemMessages.FIND_PROBLEMS_BY_COURSE_SUCCESS,
            data: problems,
            pagination
        })
    }

    @Delete(':id')
    async deleteProblem(@Param('id') id: string) {
        await this.problemsService.deleteProblem(id)

        return new DataResponse({ message: ProblemMessages.DELETE_PROBLEM_SUCCESS })
    }

    @Patch(':id')
    async updateProblem(@Param('id') id: string, @Body() updateProblemDto: UpdateProblemDto) {
        await this.problemsService.updateProblem(id, updateProblemDto)

        return new DataResponse({ message: ProblemMessages.UPDATE_PROBLEM_SUCCESS })
    }
}
