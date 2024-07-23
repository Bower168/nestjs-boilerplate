import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  await app.listen(3000).then(() => {
    logger.debug(`Server is running on http://localhost:${process.env.PORT}`);
  });
}
bootstrap();
