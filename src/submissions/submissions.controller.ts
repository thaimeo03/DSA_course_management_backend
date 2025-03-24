import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { SubmissionsService } from './submissions.service'
import { ExecuteCodeDto } from './dto/execute-code.dto'
import { DataResponse } from 'common/core/response-success.core'
import { SubmissionMessages } from 'common/constants/messages/submission.message'
import { AuthJwtGuard } from 'src/auth/guards/auth.guard'
import { Request } from 'express'

@Controller('submissions')
export class SubmissionsController {
    constructor(private readonly submissionsService: SubmissionsService) {}

    @Post('execute-code')
    @UseGuards(AuthJwtGuard)
    async executeCode(@Body() executeCodeDto: ExecuteCodeDto, @Req() req: Request) {
        const userId = req.user['userId'] as string

        const data = await this.submissionsService.executeCode(userId, executeCodeDto)

        return new DataResponse({ message: SubmissionMessages.EXECUTE_CODE_SUCCESS, data })
    }
}
