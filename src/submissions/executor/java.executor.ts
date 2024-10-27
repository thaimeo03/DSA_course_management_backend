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

                const testCaseTemplate = this.getTestCaseTemplate()

                const comparisonTemplate = this.getComparisonTemplate(
                    outputType,
                    callingFunctionTemplate,
                    outputVarTemplate
                )

                return testCaseTemplate({
                    comparison: comparisonTemplate,
                    outputVar: outputVarTemplate,
                    callingFunction: callingFunctionTemplate
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
        switch (varType) {
            case DataTypes.IntegerArray:
                return `new int[] {${val.join(', ')}}`
            case DataTypes.DoubleArray:
                return `new double[] {${val.join(', ')}}`
            case DataTypes.BooleanArray:
                return `new boolean[] {${val.join(', ')}}`
            case DataTypes.StringArray:
                return `new String[] {${val.join(', ')}}`
            case DataTypes.IntegerMatrix:
                return `new int[][] {${val.join(', ')}}`
            case DataTypes.DoubleMatrix:
                return `new double[][] {${val.join(', ')}}`
            case DataTypes.BooleanMatrix:
                return `new boolean[][] {${val.join(', ')}}`
            case DataTypes.StringMatrix:
                return `new String[][] {${val.join(', ')}}`
            default:
                return val
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
