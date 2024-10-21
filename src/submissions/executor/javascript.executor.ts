import Handlebars from 'handlebars'
import { javascriptTemplate, javascriptTestCaseTemplate } from '../templates/javascript.template'
import { CodeExecutor } from './code.executor'
import { ConfigService } from '@nestjs/config'

export class JavascriptExecutor extends CodeExecutor {
    private configService: ConfigService = new ConfigService()

    protected getCodeTemplate(): HandlebarsTemplateDelegate<any> {
        return Handlebars.compile(javascriptTemplate)
    }

    protected getTestCaseTemplate(): HandlebarsTemplateDelegate<any> {
        return Handlebars.compile(javascriptTestCaseTemplate)
    }

    protected getApiUrl(): string {
        return this.configService.get('EXECUTOR_JAVASCRIPT_API_URL')
    }
}
