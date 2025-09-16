import fastifyCompression from '@fastify/compress';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { fastifyHelmet } from '@fastify/helmet';
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );

  app.useLogger(false);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,POST,PATCH,DELETE',
  });

  app.setGlobalPrefix('api/v1/');

  const validationPipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  });

  app.useGlobalPipes(validationPipe);

  await app.register(fastifyCompression, { global: true });
  await app.register(fastifyHelmet);
  await app.listen(process.env.PORT ?? 5000);
}

void bootstrap();
