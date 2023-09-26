import { DynamicModule, Module } from '@nestjs/common';
import { EnvConfService } from './env-conf.service';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { join } from 'node:path';

@Module({
  providers: [EnvConfService]
})

export class EnvConfModule extends ConfigModule {
  // Loads process environment variables
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    return super.forRoot({
      ...options,
      envFilePath: [join(__dirname, `../../../../.env.${process.env.NODE_ENV}`)]
    });
  }
}