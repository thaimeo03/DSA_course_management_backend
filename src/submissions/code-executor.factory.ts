import { ProgrammingLanguage } from 'common/enums/index.enum'
import { JavascriptExecutor } from './executor/javascript.executor'
import { SubmissionMessages } from 'common/constants/messages/submisson.message'
import { PythonExecutor } from './executor/python.executor'
import { CodeExecutor } from './executor/code.executor'

// Factory design pattern
export class CodeExecutorFactory {
    static getExecutor(language: number): CodeExecutor {
        switch (language) {
            case ProgrammingLanguage.Javascript:
                return new JavascriptExecutor()
            case ProgrammingLanguage.Python:
                return new PythonExecutor()
            case ProgrammingLanguage.Java:
                return new JavascriptExecutor()
            default:
                throw new Error(SubmissionMessages.DOES_NOT_SUPPORT_THIS_LANGUAGE)
        }
    }
}
