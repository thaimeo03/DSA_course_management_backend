import axios from 'axios'
import { GenerateCodeTemplateDto } from '../dto/generate-template.dto'
import { GenerateTestCaseTemplateDto } from '../dto/generate-test-case-template.dto'

export abstract class CodeExecutor {
    generateCodeTemplate({ userCode, modifiedTestCasesTemplate }: GenerateCodeTemplateDto): string {
        const template = this.getCodeTemplate()

        return template({
            user_code: userCode,
            test_cases: modifiedTestCasesTemplate
        })
    }

    generateTestCasesTemplate({
        functionName,
        parsedInputs,
        parsedExpectedOutputs
    }: GenerateTestCaseTemplateDto): string {
        return parsedInputs
            .map((parsedInput, index) => {
                const testCaseTemplate = this.getTestCaseTemplate()

                return testCaseTemplate({
                    function_name: functionName,
                    parsed_inputs: parsedInput.map((input) => JSON.stringify(input)).join(', '), // [[1,2],3] => '[1,2],3'
                    expected_outputs: JSON.stringify(parsedExpectedOutputs[index])
                })
            })
            .join('\n')
    }

    async executeCode(code: string): Promise<any> {
        const apiUrl = this.getApiUrl()
        console.log(apiUrl)

        // Call API
        const res = await axios.post(apiUrl, { code })
        return res.data
    }

    protected abstract getCodeTemplate(): HandlebarsTemplateDelegate<any>
    protected abstract getTestCaseTemplate(): HandlebarsTemplateDelegate<any>
    protected abstract getApiUrl(): string
}
