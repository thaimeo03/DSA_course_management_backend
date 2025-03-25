import { BadRequestException, Injectable } from '@nestjs/common'
import { ExecuteCodeDto } from './dto/execute-code.dto'
import { ParseService } from './parse.service'
import { CodeExecutorFactory } from './code-executor.factory'
import { SourceCodesService } from 'src/source-codes/source-codes.service'
import { SubmissionStatus } from 'common/enums/submissions.enum'
import { PointsService } from 'src/points/points.service'
import { SubmissionRepository } from 'src/repositories/submission.repository'
import { TestSuitRepository } from 'src/repositories/test-suit.repository'
import { UserRepository } from 'src/repositories/user.repository'
import { ProblemRepository } from 'src/repositories/problem.repository'

@Injectable()
export class SubmissionsService {
    constructor(
        private submissionsRepository: SubmissionRepository,
        private testSuitsRepository: TestSuitRepository,
        private userRepository: UserRepository,
        private problemRepository: ProblemRepository,
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
    async executeCode(userId: string, executeCodeDto: ExecuteCodeDto) {
        const { code, language, problemId } = executeCodeDto

        // 1, 2
        const problem = await this.problemRepository.checkProblemExists({ id: problemId })

        const testSuit = await this.testSuitsRepository.checkTestSuitExists({
            problem: { id: problemId }
        })

        const user = await this.userRepository.checkUserExists({ id: userId })

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

    async getSubmissionHistory(userId: string, problemId: string) {
        // Check problem exists
        await this.problemRepository.checkProblemExists({ id: problemId })

        // Get submission history
        const submissions = await this.submissionsRepository.find({
            relations: {
                user: true,
                problem: true,
                sourceCode: true
            },
            where: {
                user: {
                    id: userId
                },
                problem: {
                    id: problemId
                }
            },
            select: {
                id: true,
                status: true,
                createdAt: true,
                sourceCode: {
                    code: true,
                    language: true
                },
                problem: {},
                user: {}
            },
            order: {
                createdAt: 'desc'
            }
        })

        return submissions
    }
}
