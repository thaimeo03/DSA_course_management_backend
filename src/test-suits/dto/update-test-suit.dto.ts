import { OmitType, PartialType } from '@nestjs/mapped-types'
import { CreateTestSuitDto } from './create-test-suit.dto'

export class UpdateTestSuitDto extends PartialType(OmitType(CreateTestSuitDto, ['problemId'])) {}
