import axios from 'axios'
import { GenerateCodeTemplateDto } from '../dto/generate-template.dto'
import { GenerateTestCaseTemplateDto } from '../dto/generate-test-case-template.dto'
import { RequestExecutorDto } from '../dto/request-executor.dto'
import { CodeExecutionResponseDto } from '../dto/code-execution-response.dto'
import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'

@Injectable()
export abstract class CodeExecutor {
    constructor(protected configService: ConfigService) {}

    // 1. Get code template from abstract method
    // 2. Generate code template
    generateCodeTemplate({ userCode, modifiedTestCasesTemplate }: GenerateCodeTemplateDto): string {
        // 1
        const template = this.getCodeTemplate()

        // 2
        return template({
            user_code: userCode,
            test_cases: modifiedTestCasesTemplate
        })
    }

    // 1. Get test case template from abstract method for each test case
    // 2. Generate test case template
    generateTestCasesTemplate({
        functionName,
        parsedInputs,
        parsedExpectedOutputs
    }: GenerateTestCaseTemplateDto): string {
        return parsedInputs
            .map((parsedInput, index) => {
                // 1
                const testCaseTemplate = this.getTestCaseTemplate()

                // 2
                return testCaseTemplate({
                    function_name: functionName,
                    parsed_inputs: parsedInput.map((input) => JSON.stringify(input)).join(', '), // [[1,2],3] => '[1,2],3'
                    expected_outputs: JSON.stringify(parsedExpectedOutputs[index])
                })
            })
            .join('\n') // Combine all test cases
    }

    // 1. Get API URL from abstract method
    // 2. Call API
    async executeCode(body: RequestExecutorDto): Promise<CodeExecutionResponseDto> {
        // 1
        const apiUrl = this.getApiUrl()
        console.log('[apiUrl]', apiUrl)

        // 2
        const res = await axios.post<CodeExecutionResponseDto>(apiUrl, body)
        return res.data
    }

    // Abstract methods
    protected abstract getCodeTemplate(): HandlebarsTemplateDelegate<any>
    protected abstract getTestCaseTemplate(): HandlebarsTemplateDelegate<any>
    protected abstract getApiUrl(): string
}
