import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfModule } from '../env-conf/env-conf.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [EnvConfModule.forRoot()],
  providers: [ConfigService, PrismaService],
  exports: [PrismaService]
})
export class DatabaseModule {}
