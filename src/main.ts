import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Adapter do fastify
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  // '0.0.0.0' to accept connection from other hosts.
  await app.listen(3000, '0.0.0.0');

}

bootstrap();