import { Test, TestingModule } from '@nestjs/testing';
import { SourceCodesService } from './source-codes.service';

describe('SourceCodesService', () => {
  let service: SourceCodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SourceCodesService],
    }).compile();

    service = module.get<SourceCodesService>(SourceCodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
