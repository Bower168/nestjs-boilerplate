import { Module } from '@nestjs/common';
import { AuthService } from './service';
import { userProviders } from 'src/entity/user/user.providers';
import { JwtService } from '@nestjs/jwt';
import { DatabaseModule } from '../typeorm/typeorm.module';
import { AuthController } from './controller';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [JwtService, AuthService, ...userProviders],
})
export class AuthModule {}
