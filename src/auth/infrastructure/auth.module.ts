import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EnvConfModule } from '@/shared/infrastructure/env-conf/env-conf.module';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfService } from '@/shared/infrastructure/env-conf/env-conf.service';

@Module({
  imports: [
    EnvConfModule,
    JwtModule.registerAsync({
      imports: [EnvConfModule],
      inject: [EnvConfService],
      useFactory: async (configService: EnvConfService) => ({
        global: true,
        secret: configService.getJwtSecret(),
        signOptions: {
          expiresIn: configService.getJwtExpiresInSeconds()
        }
      })
    })
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule { }
