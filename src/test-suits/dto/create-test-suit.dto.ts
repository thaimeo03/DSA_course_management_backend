import { IsEnum, IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator'
import { DataTypes } from 'common/enums/test-suits.enum'

export class CreateTestSuitDto {
    @IsNotEmpty()
    @IsEnum(DataTypes, { each: true })
    inputTypes: DataTypes[]

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    functionName: string

    @IsNotEmpty()
    @IsString()
    inputSuit: string

    @IsNotEmpty()
    @IsEnum(DataTypes)
    outputType: DataTypes

    @IsNotEmpty()
    @IsString()
    expectedOutputSuit: string

    @IsNotEmpty()
    @IsUUID()
    problemId: string
}
