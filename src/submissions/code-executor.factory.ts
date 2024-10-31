import { ProgrammingLanguage } from 'common/enums/index.enum'
import { JavascriptExecutor } from './executor/javascript.executor'
import { SubmissionMessages } from 'common/constants/messages/submission.message'
import { PythonExecutor } from './executor/python.executor'
import { CodeExecutor } from './executor/code.executor'
import { JavaExecutor } from './executor/java.executor'
import { Injectable, NotFoundException, Type } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'

// Factory design pattern
@Injectable()
export class CodeExecutorFactory {
    constructor(private moduleRef: ModuleRef) {}

    // Add more executors here
    private executors = new Map<ProgrammingLanguage, Type<CodeExecutor>>([
        [ProgrammingLanguage.Javascript, JavascriptExecutor],
        [ProgrammingLanguage.Python, PythonExecutor],
        [ProgrammingLanguage.Java, JavaExecutor]
    ])

    async getExecutor(language: ProgrammingLanguage): Promise<CodeExecutor> {
        const executor = this.executors.get(language)
        if (!executor)
            throw new NotFoundException(SubmissionMessages.DOES_NOT_SUPPORT_THIS_LANGUAGE)

        return await this.moduleRef.create(executor) // Create a new instance and using moduleRef for performance
    }
}
