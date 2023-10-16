import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../auth.service';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfModule } from '@/shared/infrastructure/env-conf/env-conf.module';

describe('AuthService unit tests', () => {
  let authService: AuthService
  let module: TestingModule

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [EnvConfModule, JwtModule],
      providers: [AuthService],
    }).compile();

    authService = module.get<AuthService>(AuthService);

  });

  it('Should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('Should generate a JWT', async () => {
    const result = await authService.generateJwt({ id: 'fakeId' });

    expect(typeof result).toEqual('string');
  });

  it('Should verify a JWT', async () => {
    const result = await authService.generateJwt({ id: 'fakeId' });

    await expect(authService.verifyJwt(result))
      .resolves.not.toThrowError();

  });

  it('Should throw error when verifying invalid JWT', async () => {
    await expect(authService.verifyJwt('fake-jwt'))
      .rejects.toThrow();
  });

  it('Should throw error when verifying valid, but wrong secret, JWT', async () => {
    await expect(authService.verifyJwt('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'))
      .rejects.toThrow();
  });

});
