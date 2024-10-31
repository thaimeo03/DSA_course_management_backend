import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Submission } from 'database/entities/submission.entity'
import { Repository } from 'typeorm'
import { ExecuteCodeDto } from './dto/execute-code.dto'
import { TestSuit } from 'database/entities/test-suit.entity'
import { TestSuitMessages } from 'common/constants/messages/test-suit.message'
import { ParseService } from './parse.service'
import { User } from 'database/entities/user.entity'
import { UserMessages } from 'common/constants/messages/user.message'
import { CodeExecutorFactory } from './code-executor.factory'
import { SourceCodesService } from 'src/source-codes/source-codes.service'
import { SubmissionStatus } from 'common/enums/submissions.enum'
import { PointsService } from 'src/points/points.service'
import { Problem } from 'database/entities/problem.entity'
import { ProblemMessages } from 'common/constants/messages/problem.message'

@Injectable()
export class SubmissionsService {
    constructor(
        @InjectRepository(Submission) private submissionsRepository: Repository<Submission>,
        @InjectRepository(TestSuit) private testSuitsRepository: Repository<TestSuit>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Problem) private problemRepository: Repository<Problem>,
        private codeExecutorFactory: CodeExecutorFactory,
        private sourceCodesService: SourceCodesService,
        private pointService: PointsService
    ) {}

    // 1. Get test suit, problem and user
    // 2. Check test suit, problem and user exists
    // 3. Parse input, expected output of test suit
    // 4. Generate code template match language
    // 5. Call execute code api and handle response
    // 6. Save source code and submission after execute code successfully
    // 7. Increase point if status is passed
    async executeCode(executeCodeDto: ExecuteCodeDto) {
        const { code, language, problemId, userId } = executeCodeDto

        // 1, 2
        const problem = await this.problemRepository.findOneBy({ id: problemId })
        if (!problem) throw new NotFoundException(ProblemMessages.PROBLEM_NOT_FOUND)

        const testSuit = await this.testSuitsRepository.findOneBy({ problem: { id: problemId } })
        if (!testSuit) throw new NotFoundException(TestSuitMessages.TEST_SUIT_NOT_FOUND)

        const user = await this.userRepository.findOneBy({ id: userId })
        if (!user) throw new NotFoundException(UserMessages.USER_NOT_FOUND)

        // 3
        const { functionName, inputSuit, inputTypes, outputType, expectedOutputSuit } = testSuit

        const parsedInputs = ParseService.parseInput(inputSuit, inputTypes)
        const parsedExpectedOutputs = ParseService.parseOutput(expectedOutputSuit, outputType)

        // console.log('[parsedInputs]', parsedInputs)
        // console.log('[parsedExpectedOutputs]', parsedExpectedOutputs)

        // 4
        const executor = await this.codeExecutorFactory.getExecutor(language) // Apply factory design pattern
        const modifiedTestCasesTemplate = executor.generateTestCasesTemplate({
            functionName,
            parsedInputs,
            parsedExpectedOutputs,
            inputTypes,
            outputType
        })
        const modifiedCodeTemplate = executor.generateCodeTemplate({
            userCode: code,
            modifiedTestCasesTemplate: modifiedTestCasesTemplate
        })

        // console.log('[modifiedCodeTemplate]', modifiedCodeTemplate)

        // 5
        try {
            const { message } = await executor.executeCode({
                code: modifiedCodeTemplate,
                userId,
                problemId
            })

            // 6
            const status = message.includes('All tests passed')
                ? SubmissionStatus.Passed
                : SubmissionStatus.Failed

            // Save source code
            const sourceCode = await this.sourceCodesService.createSourceCode({
                code: modifiedCodeTemplate,
                language: language
            })

            // Save submission
            const submission = await this.submissionsRepository.save({
                status,
                problem: { id: problemId },
                user,
                sourceCode
            })

            // 7
            if (status === SubmissionStatus.Passed) {
                await this.pointService.increasePoint({ userId, problemId, value: problem.point })
            }

            return {
                message,
                status: submission.status
            }
        } catch (error) {
            // Throw error extends axios error
            throw new BadRequestException(error.response?.data?.message || error.message)
        }
    }
}
