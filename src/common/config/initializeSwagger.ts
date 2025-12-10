import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";


export function initializeSwagger(app: any) {
  app.setGlobalPrefix('api', { exclude: ['/'] });

  const config = new DocumentBuilder()
    .setTitle('ObserCore API - Anomaly Detector')
    .setDescription('API for ObserCore anomaly detection')
    .setVersion('1.0.0')
    .addTag('Anomalies', 'Detect, analyze and manage anomalies')
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
    customSiteTitle: 'LavaFácilAPI - DOC',
    customCssUrl: [

    ],
    jsonDocumentUrl: 'api/docs/json',
    yamlDocumentUrl: 'api/docs/yaml',
    swaggerOptions: {
      //docExpansion: true,
      filter: true,
      showRequestHeaders: true,
      persistAuthorization: true,
    }
  };

  SwaggerModule.setup('swagger', app, document, swaggerOptionsExternal);

  app.use(
    '/api/docs',
    apiReference({
      content: document,
      theme: 'bluePlanet',
      persistAuth: true,


    }),
  );

}