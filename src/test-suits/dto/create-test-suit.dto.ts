import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator'
import { InputTypes } from 'common/enums/test-suits.enum'

export class CreateTestSuitDto {
    @IsNotEmpty()
    @IsEnum(InputTypes, { each: true })
    inputTypes: InputTypes[]

    @IsNotEmpty()
    @IsString()
    inputSuit: string

    @IsNotEmpty()
    @IsString()
    expectedOutputSuit: string

    @IsNotEmpty()
    @IsUUID()
    problemId: string
}
