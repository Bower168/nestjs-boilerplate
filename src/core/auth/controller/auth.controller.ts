import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../service';
import { RefreshTokenDto, SignInDto, SignUpDto } from '../dto';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: SignInDto) {
    return this.authService.signIn(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: SignUpDto) {
    return this.authService.signUp(registerDto);
  }

  @Post('refresh')
  async refresh(@Body() refreshToken: RefreshTokenDto) {
    return this.authService.refreshToken(refreshToken.refreshToken);
  }
}
