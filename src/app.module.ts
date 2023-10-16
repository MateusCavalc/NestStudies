import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfModule } from './shared/infrastructure/env-conf/env-conf.module';
import { UsersModule } from './users/infrastructure/users.module';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { AuthModule } from './auth/infrastructure/auth.module';

@Module({
  imports: [EnvConfModule, UsersModule, DatabaseModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
