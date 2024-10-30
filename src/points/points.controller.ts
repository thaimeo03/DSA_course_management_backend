import { Controller, Post } from '@nestjs/common'
import { PointsService } from './points.service'
import { DataResponse } from 'common/core/response-success.core'
import { PointMessages } from 'common/constants/messages/point.message'

@Controller('points')
export class PointsController {
    constructor(private readonly pointsService: PointsService) {}

    @Post('/dev/add-to-users')
    async addPointForCurrentUsers() {
        await this.pointsService.addPointForCurrentUsers()

        return new DataResponse({ message: PointMessages.ADD_POINT_TO_USERS_SUCCESS })
    }
}
