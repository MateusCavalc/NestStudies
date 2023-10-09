import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { EnvConfModule } from '../env-conf/env-conf.module';
import { PrismaService } from './prisma/prisma.service';

@Global()
@Module({
  imports: [EnvConfModule.forRoot()],
  providers: [ConfigService, PrismaService],
  exports: [PrismaService]
})
export class DatabaseModule {
  
  static forTest(prismaClient: PrismaClient): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: PrismaService,
          useFactory: () => prismaClient as PrismaService
        }
      ]
    }
  }

}