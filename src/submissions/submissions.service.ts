import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Submission } from 'database/entities/submission.entity'
import { Repository } from 'typeorm'
import { ExecuteCodeDto } from './dto/execute-code.dto'
import { TestSuit } from 'database/entities/test-suit.entity'
import { TestSuitMessages } from 'common/constants/messages/test-suit.message'
import { ParseService } from './parse.service'
import { User } from 'database/entities/user.entity'
import { UserMessages } from 'common/constants/messages/user.message'

@Injectable()
export class SubmissionsService {
    constructor(
        @InjectRepository(Submission) private submissionsRepository: Repository<Submission>,
        @InjectRepository(TestSuit) private testSuitsRepository: Repository<TestSuit>,
        @InjectRepository(User) private userRepository: Repository<User>
    ) {}

    // 1. Get test suit and user
    // 2. Check test suit and user exists
    // 3. Parse input, expected output of test suit
    // 4. Generate code template match language
    // 5. Call execute code api
    async executeCode(executeCodeDto: ExecuteCodeDto) {
        const { code, language, problemId, userId } = executeCodeDto

        // 1, 2
        const testSuit = await this.testSuitsRepository.findOneBy({ problem: { id: problemId } })
        if (!testSuit) throw new NotFoundException(TestSuitMessages.TEST_SUIT_NOT_FOUND)

        const user = await this.userRepository.findOneBy({ id: userId })
        if (!user) throw new NotFoundException(UserMessages.USER_NOT_FOUND)

        // 3
        const { functionName, inputSuit, inputTypes, outputType, expectedOutputSuit } = testSuit

        const parsedInput = ParseService.parseInput(inputSuit, inputTypes)
        const parsedExpectedOutput = ParseService.parseOutput(expectedOutputSuit, outputType)

        // 4
    }
}
