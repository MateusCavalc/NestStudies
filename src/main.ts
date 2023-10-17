import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Adapter do fastify
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { execSync } from 'child_process';
import { Logger } from '@nestjs/common';
import { applyGlobalConfig } from './global-config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

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

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Simple API Implementation')
    .setDescription('This is a simple implementation of a RESTFULL API, using NestJS and PostGres.')
    .setVersion('1.0.0')
    .addBearerAuth({
      description: 'Inform JWT to authorize the access',
      name: 'Authorization',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header'
    }).build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  applyGlobalConfig(app);

  // '0.0.0.0' to accept connection from other hosts.
  await app.listen(3000, '0.0.0.0');

}

bootstrap();