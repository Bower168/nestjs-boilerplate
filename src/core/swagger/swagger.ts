import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const BuildSwaggerDocument = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('NestJS Boilerplate')
    .setDescription('The NestJS Boilerplate API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const docs = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('/docs', app, docs, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });
};
