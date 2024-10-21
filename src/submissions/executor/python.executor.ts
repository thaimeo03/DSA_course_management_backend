import { pythonTemplate, pythonTestCaseTemplate } from '../templates/python.template'
import Handlebars from 'handlebars'
import { CodeExecutor } from './code.executor'
import { ConfigService } from '@nestjs/config'

export class PythonExecutor extends CodeExecutor {
    private configService: ConfigService = new ConfigService()

    protected getCodeTemplate(): HandlebarsTemplateDelegate<any> {
        return Handlebars.compile(pythonTemplate)
    }

    protected getTestCaseTemplate(): HandlebarsTemplateDelegate<any> {
        return Handlebars.compile(pythonTestCaseTemplate)
    }

    protected getApiUrl(): string {
        return this.configService.get('EXECUTOR_PYTHON_API_URL')
    }
}
