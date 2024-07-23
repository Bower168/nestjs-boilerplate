import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { AuthDto } from '../dto/auth.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private jwt: JwtService,
  ) {}

  async signUp(signupDetail: AuthDto) {
    const hashedPassword = await argon.hash(signupDetail.password);
    try {
      return await this.userRepository.create({
        email: signupDetail.email,
        password: hashedPassword,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Credentials already in use');
      }
      return error;
    }
  }

  async signIn(signupDetail: AuthDto) {
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
        return this.generateToken(user.id, user.email);
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
