import { Module } from '@nestjs/common'
import { TestSuitsController } from './test-suits.controller'
import { TestSuitsService } from './test-suits.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TestSuit } from 'database/entities/test-suit.entity'
import { Problem } from 'database/entities/problem.entity'

@Module({
    imports: [TypeOrmModule.forFeature([TestSuit, Problem])],
    controllers: [TestSuitsController],
    providers: [TestSuitsService]
})
export class TestSuitsModule {}
