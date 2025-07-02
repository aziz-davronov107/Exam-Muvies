import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { JwtSecret } from 'src/common/utils/jwt.secret';
import {
  ForgotPayload,
  JwtPayload,
  LoginPayload,
  LoginResponse,
  RefreshTokenPayload,
  RefreshTokenResponse,
  RegisterPayload,
  RegisterResponse,
  VerifyPayload,
} from 'src/core/types/auth.interface';
import bcrypt from 'bcrypt';
import { MailerService } from 'src/common/mailer/mailer.service';
import { RedisService } from 'src/common/redis/redis.service';
import { customAlphabet } from 'nanoid';
import { User } from 'src/core/models/user.model';

@Injectable()
export class AuthService {
  generateCode = customAlphabet('1234567890', 6);

  constructor(
    @InjectModel(User) private userModel: typeof User,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private redisService: RedisService,
  ) {}

  async getToken(id: number, IsRefreshToken: boolean) {
    if (IsRefreshToken) {
      return {
        access_token: await this.jwtService.signAsync({ sub: id }),
      };
    } else {
      return {
        access_token: await this.jwtService.signAsync({ sub: id }),
        refresh_token: await this.jwtService.signAsync(
          { sub: id },
          JwtSecret.getRefreshOptions(),
        ),
      };
    }
  }

  async register(payload: Required<RegisterPayload>) {
    let user = await this.userModel.findOne({
      where: { username: payload.email },
    });

    if (user) throw new ConflictException('User already exists');
    let code = this.generateCode();
    console.log('ishladi');

    await this.mailerService.sendMailer({ to: payload.email, code });

    let redisKey = await this.redisService.set(`register:${payload.email}`, {
      ...payload,
      code,
    });
    console.log(redisKey);

    return {
      message: `Verification code sent to ${payload.email}`,
    };
  }

  async forgutPassword(payload: ForgotPayload) {
    let user = await this.userModel.findOne({
      where: { username: payload.email },
    });

    if (user) throw new ConflictException('User already exists');
    let code = this.generateCode();

    await this.mailerService.sendMailer({ to: payload.email, code });

    await this.redisService.set(`forgot:${payload.email}`, { code });

    return {
      message: `ForgotPassword code sent to ${payload.email}`,
    };
  }
  async verify(payload: VerifyPayload) {
    let redisKey = `${payload.type}:${payload.email}`;
    console.log(redisKey);

    let data = await this.redisService.get(redisKey);

    if (!data || data.code != payload.code)
      throw new BadRequestException('Otp Expire or Password incorrect');

    if (payload.type == 'register') {
      let hash = await bcrypt.hash(data.password, 10);
      delete data.code;
      data.password = hash;

      const newUser = await this.userModel.create(data);

      await this.redisService.del(redisKey);

      let { access_token, refresh_token } = await this.getToken(
        newUser.dataValues.user_id,
        false,
      );

      return {
        access_token,
        refresh_token: refresh_token ? refresh_token : '',
      };
    }
    if (payload.type == 'forgot' && payload.newPassword) {
      const user = await this.userModel.findOne({
        where: { email: payload.email },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      let hash = await bcrypt.hash(payload.newPassword, 10);

      user.password = hash;
      await user.save();
      await this.redisService.del(redisKey);

      return { message: 'Password successfully reset' };
    }

    throw new BadRequestException(
      'New password is required for password reset',
    );
  }

  async login(payload: Required<LoginPayload>): Promise<LoginResponse> {
    let user = await this.userModel.findOne({
      where: { email: payload.email },
    });

    if (!user) throw new ConflictException('User does not exist');
    let { user_id, email, password, role } = user.get({ plain: true });

    let hash = await bcrypt.compare(payload.password, password);

    if (!hash) throw new ConflictException('Password is incorrect');

    let { access_token, refresh_token } = await this.getToken(user_id, false);

    return {
      access_token,
      refresh_token: refresh_token ? refresh_token : '',
    };
  }
  async refreshToken(id: number): Promise<RefreshTokenResponse> {
    let { access_token } = await this.getToken(id, true);

    return {
      access_token,
    };
  }
}
