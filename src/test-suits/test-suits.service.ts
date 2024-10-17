import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TestSuit } from 'database/entities/test-suit.entity'
import { Repository } from 'typeorm'
import { CreateTestSuitDto } from './dto/create-test-suit.dto'
import { Problem } from 'database/entities/problem.entity'
import { ProblemMessages } from 'common/constants/messages/problem.message'
import { TestSuitMessages } from 'common/constants/messages/test-suit.message'
import * as _ from 'lodash'
import { UpdateTestSuitDto } from './dto/update-test-suit.dto'

@Injectable()
export class TestSuitsService {
    constructor(
        @InjectRepository(TestSuit) private testSuitsRepository: Repository<TestSuit>,
        @InjectRepository(Problem) private problemRepository: Repository<Problem>
    ) {}

    // 1. Check problem exists
    // 2. Check test suit exists
    // 3. Save test suit
    async createTestSuit(createTestSuitDto: CreateTestSuitDto) {
        // 1
        const problem = await this.problemRepository.findOneBy({ id: createTestSuitDto.problemId })
        if (!problem) throw new NotFoundException(ProblemMessages.PROBLEM_NOT_FOUND)

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
        const testSuit = await this.testSuitsRepository.findOneBy({ id })
        if (!testSuit) throw new NotFoundException(TestSuitMessages.TEST_SUIT_NOT_FOUND)

        // 2
        await this.testSuitsRepository.delete(id)
    }

    // 1. Check test suit exists
    // 2. Update test suit
    async updateTestSuit(id: string, updateTestSuitDto: UpdateTestSuitDto) {
        // 1
        const testSuit = await this.testSuitsRepository.findOneBy({ id })
        if (!testSuit) throw new NotFoundException(TestSuitMessages.TEST_SUIT_NOT_FOUND)

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
