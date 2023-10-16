import { Test, TestingModule } from '@nestjs/testing';
import { EnvConfService } from '../../env-conf.service';
import { EnvConfModule } from '../../env-conf.module';

describe('EnvConfService unit tests', () => {
  let service: EnvConfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EnvConfModule.forRoot()],
      providers: [EnvConfService],
    }).compile();

    service = module.get<EnvConfService>(EnvConfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return port variable as 3000', () => {
    expect(service.getAppPort()).toBe(3000);
  });

  it('should return environment variable as \'test\'', () => {
    expect(service.getNodeEnv()).toBe('test');
  });

  it('should return jwt secret variable as \'fake_secret\'', () => {
    expect(service.getJwtSecret()).toBe('fake_secret');
  });

  it('should return jwt expires is variable as 86400', () => {
    expect(service.getJwtExpiresInSeconds()).toBe(86400);
  });
});
