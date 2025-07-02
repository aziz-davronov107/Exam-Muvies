import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from 'src/core/models/category.model';
import { Movie } from 'src/core/models/movie.model';
import { MovieFile } from 'src/core/models/movie-file.model';
import { join } from 'path';
import { deleteFile } from 'src/common/utils/delte.file';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category) private readonly categoryModel: typeof Category,
    @InjectModel(Movie) private readonly movieModel: typeof Movie,
    @InjectModel(MovieFile) private readonly movieFilesModel: typeof MovieFile,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    let category = await this.categoryModel.findOne({
      where: { slug: createCategoryDto.slug },
    });
    if (category) {
      throw new ConflictException('Slug must be created!');
    }
    let new_category = await this.categoryModel.create(
      createCategoryDto as any,
      { raw: true },
    );
    return new_category;
  }

  async findAll() {
    return await this.categoryModel.findAll();
  }

  async findOne(id: string) {
    let category = await this.categoryModel.findByPk(id, {
      include: [
        {
          model: Movie,
          attributes: [
            'movie_id',
            'title',
            'release_year',
            'duration_minutes',
            'poster_url',
          ],
        },
      ],
    });
    if (!category) {
      throw new NotFoundException('Category with the specified id not found!');
    }
    return category!.dataValues;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryModel.findByPk(id);
    if (!category) {
      throw new NotFoundException('Category with the specified id not found!');
    }
    Object.assign(category!, updateCategoryDto);
    await category.save();
    return {
      message: 'Category successfulluly updated!',
      data: category.dataValues,
    };
  }

  async remove(id: string) {
    const category = await this.categoryModel.findByPk(id);
    if (!category) {
      throw new NotFoundException('Category with the specified id not found!');
    }
    const movies = await this.movieModel.findAll({
      where: { category_id: id },
      include: [MovieFile],
    });

    movies!.forEach((movie) => {
      let poster_url_path = join(
        process.cwd(),
        'uploads',
        'posters',
        movie.dataValues.poster_url,
      );
      deleteFile(poster_url_path);

      movie.movieFiles.forEach((movieFile) => {
        let files_url_path = join(
          process.cwd(),
          'uploads',
          'files',
          movieFile.dataValues.file_url,
        );
        deleteFile(files_url_path);
      });
    });
    await category.destroy({ hooks: true });

    return {
      message: 'Category successfulluly deleted!',
    };
  }
}
