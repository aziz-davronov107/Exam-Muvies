import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('My new Project!')
    .setDescription('NestJs Swagger documents!')
    .setVersion('1.0')
    .addTag('nestJs')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/v7/swagger', app, document);
  let port = process.env.PORT || 1170;
  await app.listen(+port, '0.0.0.0');
}
bootstrap();
