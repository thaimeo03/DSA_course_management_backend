import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { TemplatesService } from './templates.service'
import { CreateTemplateDto } from './dto/create-template.dto'
import { DataResponse } from 'common/core/response-success.core'
import { TemplateMessages } from 'common/constants/messages/template.message'
import { FindTemplateByProblemIdAndLanguageDto } from './dto/find-template-by-problem-and-language.dto'
import { UpdateTemplateDto } from './dto/update-template.dto'

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

    @Get('/problem')
    async findTemplateByProblemIdAndLanguage(
        @Query() query: FindTemplateByProblemIdAndLanguageDto
    ) {
        const template = await this.templatesService.findTemplateByProblemIdAndLanguage(query)

        return new DataResponse({
            message: TemplateMessages.FIND_TEMPLATE_SUCCESS,
            data: template
        })
    }

    @Delete(':id')
    async deleteTemplate(@Param('id') id: string) {
        await this.templatesService.deleteTemplate(id)

        return new DataResponse({
            message: TemplateMessages.DELETE_TEMPLATE_SUCCESS
        })
    }

    @Patch(':id')
    async updateTemplate(@Param('id') id: string, @Body() updateTemplateDto: UpdateTemplateDto) {
        await this.templatesService.updateTemplate(id, updateTemplateDto)

        return new DataResponse({
            message: TemplateMessages.UPDATE_TEMPLATE_SUCCESS
        })
    }
}
