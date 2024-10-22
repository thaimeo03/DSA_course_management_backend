import { Module } from '@nestjs/common'
import { SourceCodesService } from './source-codes.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SourceCode } from 'database/entities/source-code.entity'

@Module({
    imports: [TypeOrmModule.forFeature([SourceCode])],
    providers: [SourceCodesService],
    exports: [SourceCodesService]
})
export class SourceCodesModule {}
