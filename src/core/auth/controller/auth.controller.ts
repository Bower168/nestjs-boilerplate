import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../service';
import { RefreshTokenDto, SignInDto, SignUpDto } from '../dto';
import { GetUser } from '../decorator';
import { JwtGuard } from '../guard';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  @Get('me')
  @UseGuards(JwtGuard)
  async me(@GetUser() user) {
    return user;
  }

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
