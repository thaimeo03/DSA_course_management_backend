import { Injectable } from '@nestjs/common'
import { DataTypes } from 'common/enums/test-suits.enum'

@Injectable()
export class ParseService {
    // 1. Split input suit into test cases of arrays
    // 2. Parse value of each test case based on input types (data type)
    static parseInput(inputSuit: string, inputTypes: DataTypes[]) {
        // 1
        const splitted = inputSuit.trim().split('\n')
        const parsedSuits: any[][] = []

        // 2
        for (let i = 0; i < splitted.length; i += inputTypes.length) {
            const curSuit = []
            for (let j = 0; j < inputTypes.length; j++)
                curSuit.push(ParseService.parseValue(splitted[i + j], inputTypes[j]))
            parsedSuits.push(curSuit)
        }

        return parsedSuits
    }

    // 1. Split expected output suit into test cases of arrays
    // 2. Parse value of each test case based on output type (data type)
    static parseOutput(expectedOutputSuit: string, outputType: DataTypes) {
        // 1
        const splitted = expectedOutputSuit.trim().split('\n')
        const passedOutputs: any[] = []

        // 2
        for (let i = 0; i < splitted.length; i++)
            passedOutputs.push(ParseService.parseValue(splitted[i], outputType))

        return passedOutputs
    }

    // Parse value based on data type
    static parseValue(value: string, type: DataTypes) {
        switch (type) {
            case DataTypes.Number:
                return Number(value)
            case DataTypes.String:
                return String(value)
            case DataTypes.Boolean:
                return Boolean(value)
            case DataTypes.Array:
                return JSON.parse(value)
            default:
                return value
        }
    }
}
