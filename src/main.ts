import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,POST,PATCH,DELETE',
  });

  app.setGlobalPrefix('api/v1');

  const validationPipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  });

  app.useGlobalPipes(validationPipe);
  await app.listen(process.env.PORT ?? 5000);
}

void bootstrap();
