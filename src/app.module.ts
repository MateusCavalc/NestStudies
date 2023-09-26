import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfModule } from './shared/infrastructure/env-conf/env-conf.module';
import { UsersModule } from './users/infrastructure/users.module';

@Module({
  imports: [EnvConfModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
