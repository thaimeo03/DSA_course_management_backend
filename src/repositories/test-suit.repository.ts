import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TestSuitMessages } from 'common/constants/messages/test-suit.message'
import { TestSuit } from 'database/entities/test-suit.entity'
import { FindOptionsWhere, Repository } from 'typeorm'

@Injectable()
export class TestSuitRepository extends Repository<TestSuit> {
    constructor(@InjectRepository(TestSuit) private testSuitsRepository: Repository<TestSuit>) {
        super(
            testSuitsRepository.target,
            testSuitsRepository.manager,
            testSuitsRepository.queryRunner
        )
    }

    // 1. Check test suit exists, if not throw error
    // 2. Return test suit
    async checkTestSuitExists(where: FindOptionsWhere<TestSuit> | FindOptionsWhere<TestSuit>[]) {
        // 1
        const testSuit = await this.testSuitsRepository.findOneBy(where)
        if (!testSuit) throw new NotFoundException(TestSuitMessages.TEST_SUIT_NOT_FOUND)

        // 2
        return testSuit
    }
}
