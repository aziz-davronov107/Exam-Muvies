import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from 'src/core/models/category.model';
import { Movie } from 'src/core/models/movie.model';
import { MovieFile } from 'src/core/models/movie-file.model';

@Module({
  imports: [SequelizeModule.forFeature([Category, Movie, MovieFile])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
