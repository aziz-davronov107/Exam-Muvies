import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { loginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() payload: RegisterDto) {
    return await this.authService.register(payload);
  }
  @Post('login')
  async login(@Body() payload: loginDto) {
    return await this.authService.login(payload);
  }
  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('refresh')
  async refreshToken(@Req() req: Request) {
    return await this.authService.refreshToken((req as any).user.id);
  }
}
