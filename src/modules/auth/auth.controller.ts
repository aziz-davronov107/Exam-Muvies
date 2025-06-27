import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { loginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerifyDto } from './dto/verify.dto';
import { ForgotDto } from './dto/forgut-pasword.dto';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() payload: RegisterDto) {
    return await this.authService.register(payload);
  }
  @Post('login')
  async login(
    @Body() payload: loginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } =
      await this.authService.login(payload);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000,
      sameSite: 'lax',
    });
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    return { message: 'Login Seccessfull ' };
  }

  @Put('forgot-password')
  async forgutPassword(@Body() payload: ForgotDto) {
    return await this.authService.forgutPassword(payload);
  }
  @Post('verify')
  async verify(
    @Body() payload: VerifyDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const resulst = await this.authService.verify(payload);
    if (resulst.access_token && resulst.refresh_token) {
      res.cookie('access_token', resulst.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 1000,
        sameSite: 'lax',
      });
      res.cookie('refresh_token', resulst.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'lax',
      });

      return { message: 'Registger Seccessfull ' };
    }
    return resulst;
  }
  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = await this.authService.refreshToken(
      (req as any).user.user_id,
    );

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000,
      sameSite: 'lax',
    });

    return { message: 'RefreshToken Seccessfull ' };
  }
}
