import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/common/models/user.models';
import { JwtSecret } from 'src/common/utils/jwt.secret';
import {
  JwtPayload,
  LoginPayload,
  LoginResponse,
  RefreshTokenPayload,
  RefreshTokenResponse,
  RegisterPayload,
  RegisterResponse,
} from 'src/core/types/auth.interface';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private jwtService: JwtService,
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

  async register(
    payload: Required<RegisterPayload>,
  ): Promise<RegisterResponse> {
    let user = await this.userModel.findOne({
      where: { username: payload.username },
    });

    if (user) throw new ConflictException('User already exists');

    let hash = await bcrypt.hash(payload.password, 10);
    let data = await this.userModel.create({ ...payload, password: hash });
    let { id, username, email, role } = data.get({ plain: true });

    let { access_token, refresh_token } = await this.getToken(id, false);

    return {
      data: { id, username, email, role },
      access_token,
      refresh_token: refresh_token ? refresh_token : '',
    };
  }
  async login(payload: Required<LoginPayload>): Promise<LoginResponse> {
    let user = await this.userModel.findOne({
      where: { email: payload.email },
    });

    if (!user) throw new ConflictException('User not already exists');
    let { id, email, password, role } = user.get({ plain: true });

    let hash = await bcrypt.compare(payload.password, password);
    console.log(payload.password, hash);

    if (!hash) throw new ConflictException('Password is incorrect');

    let { access_token, refresh_token } = await this.getToken(id, false);

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
