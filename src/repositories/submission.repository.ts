import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Submission } from 'database/entities/submission.entity'
import { Repository } from 'typeorm'

@Injectable()
export class SubmissionRepository extends Repository<Submission> {
    constructor(
        @InjectRepository(Submission) private submissionRepository: Repository<Submission>
    ) {
        super(
            submissionRepository.target,
            submissionRepository.manager,
            submissionRepository.queryRunner
        )
    }
}
