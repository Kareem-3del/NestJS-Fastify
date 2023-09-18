import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableCors();
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ERP-DEMO API')
    .addBearerAuth()
    .setContact(
      'Kareem-Adel',
      'https://github.com/Kareem-3del',
      'kareem.adel.zayed@gmail.com',
    )
    .addServer('http://127.0.0.1:3000', 'PC Server')
    .setVersion('1.0.5')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3000);
}

bootstrap();
