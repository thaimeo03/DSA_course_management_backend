import Handlebars from 'handlebars'
import { ConfigService } from '@nestjs/config'
import { CodeExecutor } from './code.executor'
import { javaTemplate, javaTestCaseTemplate } from '../templates/java.template'
import { GenerateTestCaseTemplateDto } from '../dto/generate-test-case-template.dto'
import { DataTypes } from 'common/enums/test-suits.enum'

export class JavaExecutor extends CodeExecutor {
    private configService: ConfigService = new ConfigService()

    generateTestCasesTemplate({
        functionName,
        parsedInputs,
        parsedExpectedOutputs,
        inputTypes,
        outputType
    }: GenerateTestCaseTemplateDto): string {
        const res = parsedInputs
            .map((parsedInput, index) => {
                const inputVarTemplate = parsedInput
                    .map((variable, index) => {
                        return this.getVariableTemplate(inputTypes[index], variable)
                    })
                    .join(', ')

                const outputVarTemplate = this.getVariableTemplate(
                    outputType,
                    parsedExpectedOutputs[index]
                )
                const callingFunctionTemplate = `solution.${functionName}(${inputVarTemplate})` // The solution here is a instance of Solution class used in java template
                const comparisonTemplate = this.getComparisonTemplate(
                    outputType,
                    callingFunctionTemplate,
                    outputVarTemplate
                )
                const outputObject = this.getObjectByType(outputType)

                const testCaseTemplate = this.getTestCaseTemplate()

                return testCaseTemplate({
                    comparison: comparisonTemplate,
                    output_var: outputVarTemplate,
                    calling_function: callingFunctionTemplate,
                    output_object: outputObject
                })
            })
            .join('\n')
        // console.log('[result]', res)

        return res
    }

    protected getComparisonTemplate(outputType: DataTypes, var1: string, var2: string) {
        switch (outputType) {
            case DataTypes.String:
                return `${var1}.equals(${var2})`
            case DataTypes.Integer || DataTypes.Double || DataTypes.Boolean:
                return `${var1} == ${var2}`
            default:
                return `Arrays.equals(${var1}, ${var2})`
        }
    }

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
                return `new int[][] {${varStrings}}`
            case DataTypes.DoubleMatrix:
                return `new double[][] {${varStrings}}`
            case DataTypes.BooleanMatrix:
                return `new boolean[][] {${varStrings}}`
            case DataTypes.StringMatrix:
                return `new String[][] {${varStrings}}`
            default:
                return JSON.stringify(val)
        }
    }

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
