import { Injectable } from '@nestjs/common'
import { CreateSourceCodeDto } from './dto/create-source-code.dto'
import { SourceCodeRepository } from 'src/repositories/source-code.repository'

@Injectable()
export class SourceCodesService {
    constructor(private sourceCodeRepository: SourceCodeRepository) {}

    async createSourceCode(createSourceCodeDto: CreateSourceCodeDto) {
        return await this.sourceCodeRepository.save(createSourceCodeDto)
    }
}
