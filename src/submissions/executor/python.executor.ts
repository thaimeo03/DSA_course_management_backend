import { pythonTemplate, pythonTestCaseTemplate } from '../templates/python.template'
import Handlebars from 'handlebars'
import { CodeExecutor } from './code.executor'

export class PythonExecutor extends CodeExecutor {
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
