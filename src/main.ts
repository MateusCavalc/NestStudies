import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Adapter do fastify
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { execSync } from 'child_process';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  Logger.log(`Context: ${process.env.NODE_ENV}`, 'BootStrap');

  if (process.env.NODE_ENV === 'development') {
    // Execute any pending migration to the environment
    Logger.log("Running development migrations ...", 'BootStrap');
    execSync("npx dotenv -e .env.development -- npx prisma migrate dev --schema ./src/shared/infrastructure/database/prisma/schema.prisma");
    Logger.log("Migrations were applied.", 'BootStrap');
  }

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // '0.0.0.0' to accept connection from other hosts.
  await app.listen(3000, '0.0.0.0');

}

bootstrap();