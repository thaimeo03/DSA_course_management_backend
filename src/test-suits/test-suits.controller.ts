import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { TestSuitsService } from './test-suits.service'
import { CreateTestSuitDto } from './dto/create-test-suit.dto'
import { DataResponse } from 'common/core/response-success.core'
import { TestSuitMessages } from 'common/constants/messages/test-suit.message'
import { UpdateTestSuitDto } from './dto/update-test-suit.dto'

@Controller('test-suits')
export class TestSuitsController {
    constructor(private readonly testSuitsService: TestSuitsService) {}

    @Post()
    async createTestSuit(@Body() createTestSuitDto: CreateTestSuitDto) {
        const data = await this.testSuitsService.createTestSuit(createTestSuitDto)

        return new DataResponse({ message: TestSuitMessages.CREATE_TEST_SUIT_SUCCESS, data })
    }

    @Get('/problem/:problemId')
    async findOneTestSuitByProblemId(@Param('problemId') problemId: string) {
        const data = await this.testSuitsService.findOneTestSuitByProblemId(problemId)

        return new DataResponse({
            message: TestSuitMessages.FIND_TEST_SUIT_BY_PROBLEM_SUCCESS,
            data
        })
    }

    @Delete(':id')
    async deleteTestSuit(@Param('id') id: string) {
        await this.testSuitsService.deleteTestSuit(id)

        return new DataResponse({ message: TestSuitMessages.DELETE_TEST_SUIT_SUCCESS })
    }

    @Patch(':id')
    async updateTestSuit(@Param('id') id: string, @Body() updateTestSuitDto: UpdateTestSuitDto) {
        await this.testSuitsService.updateTestSuit(id, updateTestSuitDto)

        return new DataResponse({ message: TestSuitMessages.UPDATE_TEST_SUIT_SUCCESS })
    }
}
