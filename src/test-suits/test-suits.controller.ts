import { Body, Controller, Post } from '@nestjs/common'
import { TestSuitsService } from './test-suits.service'
import { CreateTestSuitDto } from './dto/create-test-suit.dto'
import { DataResponse } from 'common/core/response-success.core'
import { TestSuitMessages } from 'common/constants/messages/test-suit.message'

@Controller('test-suits')
export class TestSuitsController {
    constructor(private readonly testSuitsService: TestSuitsService) {}

    @Post()
    async createTestSuit(@Body() createTestSuitDto: CreateTestSuitDto) {
        const data = await this.testSuitsService.createTestSuit(createTestSuitDto)

        return new DataResponse({ message: TestSuitMessages.CREATE_TEST_SUIT_SUCCESS, data })
    }
}
