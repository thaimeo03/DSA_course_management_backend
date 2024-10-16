import { Test, TestingModule } from '@nestjs/testing';
import { TestSuitsController } from './test-suits.controller';

describe('TestSuitsController', () => {
  let controller: TestSuitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestSuitsController],
    }).compile();

    controller = module.get<TestSuitsController>(TestSuitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
