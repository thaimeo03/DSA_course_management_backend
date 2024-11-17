import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TemplateMessages } from 'common/constants/messages/template.message'
import { Template } from 'database/entities/template.entity'
import { FindOptionsWhere, Repository } from 'typeorm'

@Injectable()
export class TemplateRepository extends Repository<Template> {
    constructor(@InjectRepository(Template) private templateRepository: Repository<Template>) {
        super(templateRepository.target, templateRepository.manager, templateRepository.queryRunner)
    }

    // 1. Check template exists
    // 2. Return template
    async checkTemplateExists(where: FindOptionsWhere<Template> | FindOptionsWhere<Template>[]) {
        // 1
        const template = await this.templateRepository.findOneBy(where)
        if (!template) throw new NotFoundException(TemplateMessages.TEMPLATE_NOT_FOUND)

        // 2
        return template
    }
}
