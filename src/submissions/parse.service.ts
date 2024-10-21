import { Injectable } from '@nestjs/common'
import { DataTypes } from 'common/enums/test-suits.enum'

@Injectable()
export class ParseService {
    static parseInput(inputSuit: string, inputTypes: DataTypes[]) {
        const splitted = inputSuit.trim().split('\n')
        const parsedSuits: any[][] = []

        for (let i = 0; i < splitted.length; i += inputTypes.length) {
            const curSuit = []
            for (let j = 0; j < inputTypes.length; j++)
                curSuit.push(ParseService.parseValue(splitted[i + j], inputTypes[j]))
            parsedSuits.push(curSuit)
        }

        return parsedSuits
    }

    static parseOutput(expectedOutputSuit: string, outputType: DataTypes) {
        const splitted = expectedOutputSuit.trim().split('\n')
        const passedOutputs: any[] = []

        for (let i = 0; i < splitted.length; i++)
            passedOutputs.push(ParseService.parseValue(splitted[i], outputType))

        return passedOutputs
    }

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
