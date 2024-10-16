import { Test, TestingModule } from '@nestjs/testing';
import { TestSuitsService } from './test-suits.service';

describe('TestSuitsService', () => {
  let service: TestSuitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestSuitsService],
    }).compile();

    service = module.get<TestSuitsService>(TestSuitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
