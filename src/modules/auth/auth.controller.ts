import { Body, Controller, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { loginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerifyDto } from './dto/verify.dto';
import { ForgotDto } from './dto/forgut-pasword.dto';

@ApiTags('Auth')
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
  @Put('forgot-password')
  async forgutPassword(@Body() payload: ForgotDto) {
    return await this.authService.forgutPassword(payload);
  }
  @Post('verify')
  async verify(@Body() payload: VerifyDto) {
    return await this.authService.verify(payload);
  }
  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('refresh')
  async refreshToken(@Req() req: Request) {
    return await this.authService.refreshToken((req as any).user.id);
  }
}
