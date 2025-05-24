import Handlebars from 'handlebars'
import { CodeExecutor } from './code.executor'
import { javaTemplate, javaTestCaseTemplate, solutionClassName } from '../templates/java.template'
import { GenerateTestCaseTemplateDto } from '../dto/generate-test-case-template.dto'
import { DataTypes } from 'common/enums/test-suits.enum'

export class JavaExecutor extends CodeExecutor {
    // 1. Get initial variable template of input
    // 2. Get initial variable template of output and convert it to string
    // 3. Get calling function template, create comparison template and convert it to string
    // 4. Get test case template and combine all mini templates
    generateTestCasesTemplate({
        functionName,
        parsedInputs,
        parsedExpectedOutputs,
        inputTypes,
        outputType
    }: GenerateTestCaseTemplateDto): string {
        const res = parsedInputs
            .map((parsedInput, index) => {
                // 1
                const inputTemplate = parsedInput
                    .map((variable, index) => {
                        return this.getVariableTemplate(inputTypes[index], variable)
                    })
                    .join(', ')

                // 2
                const expectedOutputTemplate = this.getVariableTemplate(
                    outputType,
                    parsedExpectedOutputs[index]
                )
                const expectedOutputStringTemplate = this.getConvertedStringOutPutVar(
                    outputType,
                    expectedOutputTemplate
                )

                // 3
                const callingFunctionTemplate = `${solutionClassName}.${functionName}(${inputTemplate})` // The solution here is a instance of Solution class used in java template
                const comparisonTemplate = this.getComparisonTemplate(
                    outputType,
                    callingFunctionTemplate,
                    expectedOutputTemplate
                )

                const parsedCallingFunctionTemplate = this.getConvertedStringOutPutVar(
                    outputType,
                    callingFunctionTemplate
                )

                // 4
                const testCaseTemplate = this.getTestCaseTemplate()

                return testCaseTemplate({
                    comparison: comparisonTemplate,
                    expected_output_string: expectedOutputStringTemplate,
                    calling_function: callingFunctionTemplate,
                    parsed_calling_function: parsedCallingFunctionTemplate
                })
            })
            .join('\n')
        // console.log('[result]', res)

        return res
    }

    // Generate comparison cases between calling function and expected output
    protected getComparisonTemplate(
        outputType: DataTypes,
        callingFunction: string,
        expectedOutput: string
    ) {
        switch (outputType) {
            case DataTypes.String:
                return `${callingFunction}.equals(${expectedOutput})`
            case DataTypes.Integer:
            case DataTypes.Double:
            case DataTypes.Boolean:
                return `${callingFunction} == ${expectedOutput}`
            default:
                return `Arrays.equals(${callingFunction}, ${expectedOutput})`
        }
    }

    // Convert variable to initial string (apply to array) - [1,2,3] => new int[] {1,2,3}
    protected getVariableTemplate(varType: DataTypes, val: any) {
        let varStrings = ''
        if (Array.isArray(val)) {
            varStrings = val.map((v) => JSON.stringify(v)).join(', ')
        }

        switch (varType) {
            case DataTypes.IntegerArray:
                return `new int[] {${varStrings}}`
            case DataTypes.DoubleArray:
                return `new double[] {${varStrings}}`
            case DataTypes.BooleanArray:
                return `new boolean[] {${varStrings}}`
            case DataTypes.StringArray:
                return `new String[] {${varStrings}}`
            case DataTypes.IntegerMatrix:
                varStrings = varStrings.replaceAll('[', '{').replaceAll(']', '}')
                return `new int[][] {${varStrings}}`
            case DataTypes.DoubleMatrix:
                varStrings = varStrings.replaceAll('[', '{').replaceAll(']', '}')
                return `new double[][] {${varStrings}}`
            case DataTypes.BooleanMatrix:
                varStrings = varStrings.replaceAll('[', '{').replaceAll(']', '}')
                return `new boolean[][] {${varStrings}}`
            case DataTypes.StringMatrix:
                varStrings = varStrings.replaceAll('[', '{').replaceAll(']', '}')
                return `new String[][] {${varStrings}}`
            default:
                return JSON.stringify(val)
        }
    }

    // Get object type based on data type
    protected getObjectByType(type: DataTypes) {
        switch (type) {
            case DataTypes.Integer:
                return 'Integer'
            case DataTypes.Double:
                return 'Double'
            case DataTypes.String:
                return 'String'
            case DataTypes.Boolean:
                return 'Boolean'
            default:
                return 'Arrays'
        }
    }

    // Convert value to string with depend on data type
    protected getConvertedStringOutPutVar(varType: DataTypes, val: any) {
        if (varType === DataTypes.String) return val // no need to convert

        const objType = this.getObjectByType(varType)
        return `${objType}.toString(${val})`
    }

    protected getCodeTemplate(): HandlebarsTemplateDelegate<any> {
        return Handlebars.compile(javaTemplate)
    }

    protected getTestCaseTemplate(): HandlebarsTemplateDelegate<any> {
        return Handlebars.compile(javaTestCaseTemplate)
    }

    protected getApiUrl(): string {
        return this.configService.get('EXECUTOR_JAVA_API_URL')
    }
}
