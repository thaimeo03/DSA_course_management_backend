import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateTestSuitDto } from './dto/create-test-suit.dto'
import { TestSuitMessages } from 'common/constants/messages/test-suit.message'
import * as _ from 'lodash'
import { UpdateTestSuitDto } from './dto/update-test-suit.dto'
import { TestSuitRepository } from 'src/repositories/test-suit.repository'
import { ProblemRepository } from 'src/repositories/problem.repository'

@Injectable()
export class TestSuitsService {
    constructor(
        private testSuitsRepository: TestSuitRepository,
        private problemRepository: ProblemRepository
    ) {}

    // 1. Check problem exists
    // 2. Check test suit exists
    // 3. Save test suit
    async createTestSuit(createTestSuitDto: CreateTestSuitDto) {
        // 1
        const problem = await this.problemRepository.checkProblemExists({
            id: createTestSuitDto.problemId
        })

        // 2
        const testSuitExists = await this.testSuitsRepository.findOneBy({
            problem: { id: createTestSuitDto.problemId }
        })
        if (testSuitExists) throw new BadRequestException(TestSuitMessages.TEST_SUIT_ALREADY_EXISTS)

        // 3
        const testSuit = await this.testSuitsRepository.save({
            ...createTestSuitDto,
            problem
        })

        return _.omit(testSuit, ['problem'])
    }

    // 1. Check test suit exists
    // 2. Delete test suit
    async deleteTestSuit(id: string) {
        // 1
        await this.testSuitsRepository.checkTestSuitExists({ id })

        // 2
        await this.testSuitsRepository.delete(id)
    }

    // 1. Check test suit exists
    // 2. Update test suit
    async updateTestSuit(id: string, updateTestSuitDto: UpdateTestSuitDto) {
        // 1
        await this.testSuitsRepository.checkTestSuitExists({ id })

        // 2
        if (Object.keys(updateTestSuitDto).length > 0) {
            await this.testSuitsRepository.update(id, updateTestSuitDto)
        }
    }

    async findOneTestSuitByProblemId(problemId: string) {
        const testSuit = await this.testSuitsRepository.findOneBy({ problem: { id: problemId } })
        return testSuit
    }
}
