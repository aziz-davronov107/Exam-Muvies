import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from '@nestjs/sequelize';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtSecret } from 'src/common/utils/jwt.secret';
import { User } from '../models/user.model';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(@InjectModel(User) private userModel: typeof User) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies['refresh_token'];
        },
      ]),
      secretOrKey: JwtSecret.getRefreshSecret(),
    });
  }

  async validate(payload: any) {
    const user = await this.userModel.findByPk(payload.sub);

    if (!user) throw new UnauthorizedException('User does not exist');

    return user;
  }
}
