import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PUBLIC } from '../decorators/public.decorators';
import { InjectModel } from '@nestjs/sequelize';
import { Movie } from '../models/movie.model';
import { SUBSCRIPTION_TYPE } from '../types/enum.types';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(Movie) private readonly movieModel: typeof Movie,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const cls = context.getClass();
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC, [
      handler,
      cls,
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
    if (isPublic) return true;
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      handler,
      cls,
    ]);
    if (!roles) throw new ForbiddenException('Role required!');

    if (roles.includes(request['user'].role)) return true;

    throw new ForbiddenException('Insufficient role');
  }
}
