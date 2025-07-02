import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { PUBLIC } from '../decorators/public.decorators';
import { InjectModel } from '@nestjs/sequelize';
import { Movie } from '../models/movie.model';
import { SUBSCRIPTION_TYPE } from '../types/enum.types';

@Injectable()
export class JwtAccessAuthGuard extends AuthGuard('jwt-access') {
  constructor(
    private reflector: Reflector,
    @InjectModel(Movie) private readonly movieModel: typeof Movie,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const Public = this.reflector.getAllAndOverride<boolean>(PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);
    const movie_id = request.params.movie_id;
    if (movie_id) {
      let movie = await this.movieModel.findByPk(movie_id, {
        attributes: ['subscription_type'],
      });
      if (movie?.subscription_type === SUBSCRIPTION_TYPE.FREE) {
        return true;
      }
    }
    if (Public) {
      return true;
    }

    return super.canActivate(context) as boolean;
  }
}
