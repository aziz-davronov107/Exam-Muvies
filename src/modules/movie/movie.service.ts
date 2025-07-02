import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Movie } from 'src/core/models/movie.model';
import { GetAllMoviesDto } from './dto/query-dto';
import { col, fn, where, WhereOptions } from 'sequelize';
import { UserSubscription } from 'src/core/models/user-subscription.model';
import { MovieFile } from 'src/core/models/movie-file.model';
import { Review } from 'src/core/models/review.model';
import { SUBSCRIPTION_TYPE } from 'src/core/types/enum.types';
import { Op } from 'sequelize';
import { SubscriptionPlan } from 'src/core/models/subscription-plan.model';
import { CreateMovieDetailDto } from './dto/files.created.dto';
import { deleteFile } from 'src/common/utils/delte.file';
import { join } from 'path';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie) private readonly movieModel: typeof Movie,
    @InjectModel(UserSubscription)
    private readonly user_subscriptionsModel: typeof UserSubscription,
    @InjectModel(MovieFile) private readonly movie_fileModel: typeof MovieFile,
  ) {}

  async createMovies(
    id: string,
    createMovieDto: CreateMovieDto,
    poster_url: any,
  ) {
    let slug = createMovieDto.slug.trim().split(' ').join('-');
    createMovieDto.slug = slug;
    let movie = (await this.movieModel.create({
      ...createMovieDto,
      created_by: id,
      poster_url,
    })) as any;
    delete movie.view_count;
    delete movie.rating;
    return {
      message: 'Movie Successfully created!',
      data: movie,
    };
  }

  async createFiles(details: CreateMovieDetailDto, files: any) {
    let { size, filename } = files;

    let movie_file = await this.movie_fileModel.create(
      { ...details, filename },
      { raw: true },
    );

    return {
      message: 'MovieFile Successfully created!',
      data: movie_file,
    };
  }

  async findAll(query: GetAllMoviesDto) {
    const { page = 1, limit = 10, ...filters } = query;

    const where: WhereOptions = {};
    for (const [key, value] of Object.entries(filters)) {
      where[key] = value;
    }
    const offset = (page - 1) * limit;
    let { rows, count } = await this.movieModel.findAndCountAll({
      where,
      limit,
      offset,
    });

    rows['pagination'] = {
      count,
      page,
      limit,
      pages: Math.ceil(count / limit),
    };
    return {
      data: rows,
    };
  }

  async findOne(id: string, user_id: string) {
    const movie = await this.movieModel.findByPk(id, {
      include: [
        MovieFile,
        {
          model: Review,
          attributes: [
            [fn('COUNT', col('id')), 'comment_count'],
            [fn('AVG', col('rating')), 'avg_rating'],
          ],
          duplicating: false,
        },
      ],
      group: ['Movie.movie_id', 'MovieFiles.movie_file_id'],
    });
    if (movie?.subscription_type == SUBSCRIPTION_TYPE.PREMIUM) {
      const user_subscription = await this.user_subscriptionsModel.findOne({
        where: {
          user_id,
          end_date: { [Op.gt]: new Date() },
        },
        include: [
          {
            model: SubscriptionPlan,
            where: {
              name: 'premium',
              is_active: true,
            },
          },
        ],
      });

      if (!user_subscription)
        throw new NotFoundException(
          'Your subscription was not found or expired. Please purchase a subscription to access this content.',
        );
    }

    return {
      data: movie,
    };
  }

  async update(id: string, updateMovieDto: UpdateMovieDto, filename: string) {
    let movie = await this.movieModel.findByPk(id);
    if (!movie)
      throw new NotFoundException('Movie with the specified id not found!');

    if (filename) {
      if (movie.poster_url) {
        deleteFile(join(process.cwd(), 'uploads', 'posters', movie.poster_url));
      }
      movie.poster_url = filename;
    }
    Object.assign(movie, updateMovieDto);
    await movie.save();
    return {
      message: 'Movie Successfull update',
      data: movie,
    };
  }

  async removeMovie(id: string) {
    let movie = await this.movieModel.findByPk(id, { include: [MovieFile] });

    if (!movie)
      throw new NotFoundException('Movie with the specified id not found!');
    if (movie.poster_url) {
      let poster_url_path = join(
        process.cwd(),
        'uploads',
        'posters',
        movie.poster_url,
      );
      deleteFile(poster_url_path);
    }
    movie.movieFiles.forEach((movie) => {
      let files = join(process.cwd(), 'uploads', 'files', movie.file_url);
      deleteFile(files);
    });
    await movie.destroy({ hooks: true });
    return `Movie Successfull deleted`;
  }
  async removeFile(id: string) {
    let files = await this.movie_fileModel.findByPk(id);

    if (!files)
      throw new NotFoundException('Files with the specified id not found!');
    if (files.file_url) {
      let file_url = join(process.cwd(), 'uploads', 'files', files.file_url);
      deleteFile(file_url);
    }
    return `Files Successfull deleted`;
  }
}
