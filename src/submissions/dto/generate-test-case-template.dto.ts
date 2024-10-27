import { DataTypes } from 'common/enums/test-suits.enum'

export class GenerateTestCaseTemplateDto {
    functionName: string
    parsedInputs: any[][]
    parsedExpectedOutputs: any[]
    inputTypes: DataTypes[]
    outputType: DataTypes
}
