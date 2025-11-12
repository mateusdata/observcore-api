
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    forbidNonWhitelisted: true,

  }));
  app.enableCors({ origin: '*' });

  app.setGlobalPrefix('api', { exclude: ['/'] });

  const config = new DocumentBuilder()
    .setTitle('Observcore API')
    .setDescription('API para gerenciamento do observcore')
    .setVersion('1.0.0')
    .addTag('Users', 'Create, read, update and delete users')

    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  document.security = [{ 'JWT-auth': [] }];

  const swaggerOptionsExternal = {
    customSiteTitle: 'Observcore-api - DOC',
    customCssUrl: [

    ],
    jsonDocumentUrl: 'api/docs/json',
    yamlDocumentUrl: 'api/docs/yaml',
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      persistAuthorization: true,
    }
  };

  SwaggerModule.setup('swagger', app, document, swaggerOptionsExternal);

  app.use(
    '/docs',
    apiReference({
      content: document,
      theme: 'bluePlanet',
      persistAuth: true,


    }),
  );


  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/api`, 'Bootstrap');
  Logger.log(`📚 Scalar Docs available at: http://localhost:${port}/docs`, 'Bootstrap');
  Logger.log(`📝 Swagger UI available at: http://localhost:${port}/swagger`, 'Bootstrap');
}

bootstrap();