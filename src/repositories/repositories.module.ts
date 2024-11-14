import { DynamicModule, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type'

@Module({})
export class RepositoriesModule {
    static register(entities: EntityClassOrSchema[] = [], repositories: any[] = []): DynamicModule {
        return {
            module: RepositoriesModule,
            imports: [TypeOrmModule.forFeature(entities)],
            providers: [...repositories],
            exports: [...repositories]
        }
    }
}
