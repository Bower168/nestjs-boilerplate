import {
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { SignInDto, SignUpDto } from '../dto/auth.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user/user.entity';
import * as _ from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private jwt: JwtService,
  ) {}

  async signUp(signupDetail: SignUpDto) {
    const hashedPassword = await argon.hash(signupDetail.password);
    const user = await this.userRepository.findOneBy({
      email: signupDetail.email,
    });
    if (user) {
      throw new HttpException('User already exist', 409);
    }
    const result = await this.userRepository.save({
      name: signupDetail.name,
      email: signupDetail.email,
      password: hashedPassword,
    });
    return _.pick(result, ['id', 'name', 'email']);
  }

  async signIn(signupDetail: SignInDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: signupDetail.email,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
    if (user) {
      const result = await argon.verify(user.password, signupDetail.password);
      if (result) {
        delete user.password;
        return this.generateToken(user.id, user.email, signupDetail.rememberMe);
      } else {
        throw new ForbiddenException('Credentials not match');
      }
    } else {
      throw new ForbiddenException('Credentials not found');
    }
  }

  async generateToken(
    userId: number,
    email: string,
    rememberMe?: boolean,
  ): Promise<{ access_token: string; remember_token?: string }> {
    const payload = {
      userId,
      email,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN,
      secret: process.env.JWT_SECRET,
    });
    if (rememberMe) {
      const rememberToken = await this.jwt.signAsync(payload, {
        expiresIn: process.env.JWT_REMEMBER_EXPIRES_IN,
        secret: process.env.JWT_SECRET,
      });
      await this.userRepository.update(payload.userId, {
        remember_token: rememberToken,
      });
      return { access_token: token, remember_token: rememberToken };
    }
    return { access_token: token };
  }

  async refreshToken(token: string) {
    const payload = await this.jwt.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });
    return this.generateToken(payload.userId, payload.email, true);
  }
}
