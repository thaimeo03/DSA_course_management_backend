import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Problem } from 'database/entities/problem.entity'
import { Template } from 'database/entities/template.entity'
import { Repository } from 'typeorm'
import { CreateTemplateDto } from './dto/create-template.dto'
import { ProblemMessages } from 'common/constants/messages/problem.message'
import * as _ from 'lodash'
import { TemplateMessages } from 'common/constants/messages/template.message'

@Injectable()
export class TemplatesService {
    constructor(
        @InjectRepository(Template) private templateRepository: Repository<Template>,
        @InjectRepository(Problem) private problemRepository: Repository<Problem>
    ) {}

    // 1. Check problem exists
    // 2. Check language exists
    // 3. Save template
    async createTemplate(createTemplateDto: CreateTemplateDto) {
        // 1
        const problem = await this.problemRepository.findOneBy({ id: createTemplateDto.problemId })
        if (!problem) throw new NotFoundException(ProblemMessages.PROBLEM_NOT_FOUND)

        // 2
        const templateExists = await this.templateRepository.findOneBy({
            problem: { id: createTemplateDto.problemId },
            language: createTemplateDto.language
        })
        if (templateExists)
            throw new BadRequestException(
                TemplateMessages.LANGUAGE_ALREADY_EXISTS_WITH_THIS_PROBLEM
            )

        // 3
        const template = await this.templateRepository.save({
            ...createTemplateDto,
            problem
        })

        return _.omit(template, ['problem'])
    }
}
