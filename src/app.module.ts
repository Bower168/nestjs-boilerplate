import { Module } from '@nestjs/common';
import { validate } from './core/env/env.validation';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ validate })],
})
export class AppModule {}
