import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from '@nestjs/sequelize';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/common/models/user.models';
import { JwtSecret } from 'src/common/utils/jwt.secret';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(@InjectModel(User) private userModel: typeof User) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JwtSecret.getAccessSecret(),
    });
  }

  async validate(payload: any) {
    const user = await this.userModel.findByPk(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    return user;
  }
}
