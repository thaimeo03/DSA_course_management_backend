import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Template } from 'database/entities/template.entity'
import { Repository } from 'typeorm'

@Injectable()
export class TemplateRepository extends Repository<Template> {
    constructor(@InjectRepository(Template) private templateRepository: Repository<Template>) {
        super(templateRepository.target, templateRepository.manager, templateRepository.queryRunner)
    }
}
