import Handlebars from 'handlebars'
import { javascriptTemplate, javascriptTestCaseTemplate } from '../templates/javascript.template'
import { CodeExecutor } from './code.executor'

export class JavascriptExecutor extends CodeExecutor {
    protected getCodeTemplate(): HandlebarsTemplateDelegate<any> {
        return Handlebars.compile(javascriptTemplate)
    }

    protected getTestCaseTemplate(): HandlebarsTemplateDelegate<any> {
        return Handlebars.compile(javascriptTestCaseTemplate)
    }

    async executeCode(code: string): Promise<any> {}
}
