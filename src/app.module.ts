import { Module } from '@nestjs/common';
import { validate } from './core/env/env.validation';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './core/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({ validate }), AuthModule],
})
export class AppModule {}
