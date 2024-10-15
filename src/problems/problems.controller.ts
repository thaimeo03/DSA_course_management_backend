import { Body, Controller, Post } from '@nestjs/common'
import { ProblemsService } from './problems.service'
import { CreateProblemDto } from './dto/create-problem.dto'
import { ProblemMessages } from 'common/constants/messages/problem.message'
import { DataResponse } from 'common/core/response-success.core'

@Controller('problems')
export class ProblemsController {
    constructor(private readonly problemsService: ProblemsService) {}

    @Post()
    async createProblem(@Body() createProblemDto: CreateProblemDto) {
        const data = await this.problemsService.createProblem(createProblemDto)

        return new DataResponse({ message: ProblemMessages.CREATE_PROBLEM_SUCCESS, data })
    }
}
