import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfModule } from './shared/infrastructure/env-conf/env-conf.module';

@Module({
  imports: [EnvConfModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
