import { Module } from '@nestjs/common';
import { AuthService } from './service';
import { userProviders } from 'src/entity/user/user.providers';
import { JwtService } from '@nestjs/jwt';
import { DatabaseModule } from '../TypeORM/typeorm.module';

@Module({
  imports: [DatabaseModule],
  providers: [JwtService, AuthService, ...userProviders],
})
export class AuthModule {}
