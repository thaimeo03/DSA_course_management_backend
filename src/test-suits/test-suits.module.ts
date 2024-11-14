import { Module } from '@nestjs/common'
import { TestSuitsController } from './test-suits.controller'
import { TestSuitsService } from './test-suits.service'
import { TestSuit } from 'database/entities/test-suit.entity'
import { Problem } from 'database/entities/problem.entity'
import { RepositoriesModule } from 'src/repositories/repositories.module'
import { TestSuitRepository } from 'src/repositories/test-suit.repository'
import { ProblemRepository } from 'src/repositories/problem.repository'

@Module({
    imports: [
        RepositoriesModule.register([TestSuit, Problem], [TestSuitRepository, ProblemRepository])
    ],
    controllers: [TestSuitsController],
    providers: [TestSuitsService]
})
export class TestSuitsModule {}
