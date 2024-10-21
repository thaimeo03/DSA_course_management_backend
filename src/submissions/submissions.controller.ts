import { Body, Controller, Post } from '@nestjs/common'
import { SubmissionsService } from './submissions.service'
import { ExecuteCodeDto } from './dto/execute-code.dto'
import { DataResponse } from 'common/core/response-success.core'
import { SubmissionMessages } from 'common/constants/messages/submisson.message'

@Controller('submissions')
export class SubmissionsController {
    constructor(private readonly submissionsService: SubmissionsService) {}

    @Post('execute-code')
    async executeCode(@Body() executeCodeDto: ExecuteCodeDto) {
        await this.submissionsService.executeCode(executeCodeDto)

        return new DataResponse({ message: SubmissionMessages.EXECUTE_CODE_SUCCESS })
    }
}
