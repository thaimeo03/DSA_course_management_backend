import Handlebars from 'handlebars'
import { ConfigService } from '@nestjs/config'
import { CodeExecutor } from './code.executor'
import { javaTemplate, javaTestCaseTemplate } from '../templates/java.template'
import { GenerateTestCaseTemplateDto } from '../dto/generate-test-case-template.dto'

export class JavaExecutor extends CodeExecutor {
    private configService: ConfigService = new ConfigService()

    generateTestCasesTemplate({
        functionName,
        parsedInputs,
        parsedExpectedOutputs,
        inputTypes,
        outputType
    }: GenerateTestCaseTemplateDto): string {
        return ''
    }

    protected getCodeTemplate(): HandlebarsTemplateDelegate<any> {
        return Handlebars.compile(javaTemplate)
    }

    protected getTestCaseTemplate(): HandlebarsTemplateDelegate<any> {
        return Handlebars.compile(javaTestCaseTemplate)
    }

    protected getApiUrl(): string {
        return this.configService.get('EXECUTOR_JAVA_API_URL')
    }
}
