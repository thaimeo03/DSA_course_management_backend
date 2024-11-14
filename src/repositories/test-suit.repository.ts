import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TestSuit } from 'database/entities/test-suit.entity'
import { Repository } from 'typeorm'

@Injectable()
export class TestSuitRepository extends Repository<TestSuit> {
    constructor(@InjectRepository(TestSuit) private testSuitsRepository: Repository<TestSuit>) {
        super(
            testSuitsRepository.target,
            testSuitsRepository.manager,
            testSuitsRepository.queryRunner
        )
    }
}
