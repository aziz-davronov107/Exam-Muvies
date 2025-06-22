import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  const config = new DocumentBuilder()
  .setTitle("My new Project!")
  .setDescription("NestJs Swagger documents!")
  .setVersion('1.0')
  .addTag('nestJs')
  .build();

  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('v7/swagger',app,document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
