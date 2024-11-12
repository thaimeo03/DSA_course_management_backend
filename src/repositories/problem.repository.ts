import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProblemMessages } from 'common/constants/messages/problem.message'
import { Problem } from 'database/entities/problem.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ProblemRepository extends Repository<Problem> {
    constructor(@InjectRepository(Problem) private problemRepository: Repository<Problem>) {
        super(problemRepository.target, problemRepository.manager, problemRepository.queryRunner)
    }

    // 1. Check problem exists
    // 2. Return problem
    async checkProblemExists(id: string) {
        // 1
        const problem = await this.problemRepository.findOneBy({ id })
        if (!problem) throw new NotFoundException(ProblemMessages.PROBLEM_NOT_FOUND)

        // 2
        return problem
    }
}