import { Module } from '@nestjs/common'
import { TemplatesController } from './templates.controller'
import { TemplatesService } from './templates.service'
import { Template } from 'database/entities/template.entity'
import { Problem } from 'database/entities/problem.entity'
import { RepositoriesModule } from 'src/repositories/repositories.module'
import { TemplateRepository } from 'src/repositories/template.repository'
import { ProblemRepository } from 'src/repositories/problem.repository'

@Module({
    imports: [
        RepositoriesModule.register([Template, Problem], [TemplateRepository, ProblemRepository])
    ],
    controllers: [TemplatesController],
    providers: [TemplatesService]
})
export class TemplatesModule {}
