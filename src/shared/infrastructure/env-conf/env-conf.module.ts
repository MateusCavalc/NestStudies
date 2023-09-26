import { Module } from '@nestjs/common';
import { EnvConfService } from './env-conf.service';

@Module({
  providers: [EnvConfService]
})
export class EnvConfModule {}
