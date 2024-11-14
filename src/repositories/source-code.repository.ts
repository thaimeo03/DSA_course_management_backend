import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SourceCode } from 'database/entities/source-code.entity'
import { Repository } from 'typeorm'

@Injectable()
export class SourceCodeRepository extends Repository<SourceCode> {
    constructor(
        @InjectRepository(SourceCode) private sourceCodeRepository: Repository<SourceCode>
    ) {
        super(
            sourceCodeRepository.target,
            sourceCodeRepository.manager,
            sourceCodeRepository.queryRunner
        )
    }
}
