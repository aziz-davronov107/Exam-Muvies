import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from '@nestjs/sequelize';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtSecret } from 'src/common/utils/jwt.secret';
import { User } from '../models/user.model';
import { Request } from 'express';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(@InjectModel(User) private userModel: typeof User) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies['access_token'];
        },
      ]),
      secretOrKey: JwtSecret.getAccessSecret(),
    });
  }

  async validate(payload: any) {
    console.log('ishaldi');

    const user = await this.userModel.findByPk(payload.sub, { raw: true });

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    return user;
  }
}
