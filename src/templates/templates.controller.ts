import { Body, Controller, Post } from '@nestjs/common'
import { TemplatesService } from './templates.service'
import { CreateTemplateDto } from './dto/create-template.dto'
import { DataResponse } from 'common/core/response-success.core'
import { TemplateMessages } from 'common/constants/messages/template.message'

@Controller('templates')
export class TemplatesController {
    constructor(private readonly templatesService: TemplatesService) {}

    @Post()
    async createTemplate(@Body() createTemplateDto: CreateTemplateDto) {
        const template = await this.templatesService.createTemplate(createTemplateDto)

        return new DataResponse({
            message: TemplateMessages.CREATE_TEMPLATE_SUCCESS,
            data: template
        })
    }
}
