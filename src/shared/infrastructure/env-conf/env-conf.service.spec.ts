import { Test, TestingModule } from '@nestjs/testing';
import { EnvConfService } from './env-conf.service';

describe('EnvConfService', () => {
  let service: EnvConfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnvConfService],
    }).compile();

    service = module.get<EnvConfService>(EnvConfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
