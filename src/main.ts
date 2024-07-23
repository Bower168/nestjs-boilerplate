import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { BuildSwaggerDocument } from './core/swagger/swagger';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors({ origin: true }); // app.enableCors({ origin: ['https://example1.com', 'https://example2.com'] });
  BuildSwaggerDocument(app);

  await app.listen(process.env.PORT).then(() => {
    logger.debug(`Server is running on http://localhost:${process.env.PORT}`);
  });
}
bootstrap();
