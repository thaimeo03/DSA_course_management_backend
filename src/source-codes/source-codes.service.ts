import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SourceCode } from 'database/entities/source-code.entity'
import { Repository } from 'typeorm'
import { CreateSourceCodeDto } from './dto/create-source-code.dto'
import { Submission } from 'database/entities/submission.entity'
import { SubmissionMessages } from 'common/constants/messages/submisson.message'

@Injectable()
export class SourceCodesService {
    constructor(
        @InjectRepository(SourceCode) private sourceCodeRepository: Repository<SourceCode>
    ) {}

    async createSourceCode(createSourceCodeDto: CreateSourceCodeDto) {
        return await this.sourceCodeRepository.save(createSourceCodeDto)
    }
}
