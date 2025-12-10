
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';
import { initializeSwagger } from './common/config/initializeSwagger';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({ prefix: "Backend-observcore", json: false }),
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }));

  app.enableCors({ origin: '*' });
  initializeSwagger(app)

  const port = process.env.PORT || 3333;
  await app.listen(port);


  Logger.log(`Application is running on: http://localhost:${port}/api`, 'Bootstrap');
  Logger.log(`Scalar Docs available at: http://localhost:${port}/api/docs`, 'Bootstrap');
  Logger.log(`Swagger UI available at: http://localhost:${port}/swagger`, 'Bootstrap');


}

bootstrap();