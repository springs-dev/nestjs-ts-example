import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const swaggerOptions = new DocumentBuilder()
    .setTitle('Project_X backend')
    .setDescription('Project_X server documentation.')
    .setVersion(process.env.API_VERSION)
    .addBearerAuth()
    .build();

  const SwaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      skipUndefinedProperties: true,
      skipNullProperties: true,
    }),
  );

  const allowedOrigins = [new RegExp('(https?://.*project-x.com)')];

  if (process.env.NODE_ENV !== 'production') {
    SwaggerModule.setup('docs', app, SwaggerDocument);
    allowedOrigins.push(new RegExp('(https?://localhost.*):(\\d*)'));
  }

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  });

  try {
    await app.listen(+process.env.PORT, process.env.HOST);
  } catch (e) {
    Logger.error(e.message);
  }
}

bootstrap();
