import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { PointsService } from './points.service'
import { DataResponse } from 'common/core/response-success.core'
import { PointMessages } from 'common/constants/messages/point.message'
import { AuthJwtGuard } from 'src/auth/guards/auth.guard'
import { Request } from 'express'

@Controller('points')
export class PointsController {
    constructor(private readonly pointsService: PointsService) {}

    @Get('me')
    @UseGuards(AuthJwtGuard)
    async getMyPoints(@Req() req: Request) {
        const userId = req.user['userId'] as string

        const data = await this.pointsService.getMyPoints(userId)

        return new DataResponse({
            message: PointMessages.GET_MY_POINTS_SUCCESS,
            data
        })
    }
}
