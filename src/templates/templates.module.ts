import { Module } from '@nestjs/common'
import { TemplatesController } from './templates.controller'
import { TemplatesService } from './templates.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Template } from 'database/entities/template.entity'
import { Problem } from 'database/entities/problem.entity'

@Module({
    imports: [TypeOrmModule.forFeature([Template, Problem])],
    controllers: [TemplatesController],
    providers: [TemplatesService]
})
export class TemplatesModule {}
