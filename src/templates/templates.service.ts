import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateTemplateDto } from './dto/create-template.dto'
import { ProblemMessages } from 'common/constants/messages/problem.message'
import * as _ from 'lodash'
import { TemplateMessages } from 'common/constants/messages/template.message'
import { UpdateTemplateDto } from './dto/update-template.dto'
import { FindTemplateByProblemIdAndLanguageDto } from './dto/find-template-by-problem-and-language.dto'
import { TemplateRepository } from 'src/repositories/template.repository'
import { ProblemRepository } from 'src/repositories/problem.repository'

@Injectable()
export class TemplatesService {
    constructor(
        private templateRepository: TemplateRepository,
        private problemRepository: ProblemRepository
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

    // 1. Check problem exists
    // 2. Find template
    async findTemplateByProblemIdAndLanguage({
        problemId,
        language
    }: FindTemplateByProblemIdAndLanguageDto) {
        // 1
        const problem = await this.problemRepository.findOneBy({ id: problemId })
        if (!problem) throw new NotFoundException(ProblemMessages.PROBLEM_NOT_FOUND)

        // 2
        const template = await this.templateRepository.findOneBy({
            problem: { id: problemId },
            language
        })

        return template
    }

    // 1. Check template exists
    // 2. Delete template
    async deleteTemplate(id: string) {
        // 1
        const template = await this.templateRepository.findOneBy({ id })
        if (!template) throw new NotFoundException(TemplateMessages.TEMPLATE_NOT_FOUND)

        // 2
        await this.templateRepository.delete(id)
    }

    // 1. Check template exists
    // 2. Update template
    async updateTemplate(id: string, updateTemplateDto: UpdateTemplateDto) {
        // 1
        const template = await this.templateRepository.findOneBy({ id })
        if (!template) throw new NotFoundException(TemplateMessages.TEMPLATE_NOT_FOUND)

        // 2
        await this.templateRepository.update(id, updateTemplateDto)
    }
}
