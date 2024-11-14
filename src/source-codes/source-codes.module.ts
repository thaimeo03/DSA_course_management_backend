import { Module } from '@nestjs/common'
import { SourceCodesService } from './source-codes.service'
import { SourceCode } from 'database/entities/source-code.entity'
import { RepositoriesModule } from 'src/repositories/repositories.module'
import { SourceCodeRepository } from 'src/repositories/source-code.repository'

@Module({
    imports: [RepositoriesModule.register([SourceCode], [SourceCodeRepository])],
    providers: [SourceCodesService],
    exports: [SourceCodesService]
})
export class SourceCodesModule {}
