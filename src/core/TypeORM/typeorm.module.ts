import { Module } from '@nestjs/common';
import { databaseProviders } from './typeorm.providers';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
