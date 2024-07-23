import { Module } from '@nestjs/common';
import { AuthService } from './service';
import { userProviders } from 'src/entity/user/user.providers';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../typeorm/typeorm.module';
import { AuthController } from './controller';
import { JwtStrategy } from './strategy';

@Module({
  imports: [DatabaseModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService, ...userProviders],
})
export class AuthModule {}
