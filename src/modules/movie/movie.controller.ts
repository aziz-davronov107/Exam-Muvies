import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UnsupportedMediaTypeException,
  Req,
  Query,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Roles } from 'src/core/decorators/role.decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { ROLES } from 'src/core/types/enum.types';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GetAllMoviesDto } from './dto/query-dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { CreateMovieDetailDto } from './dto/files.created.dto';

@ApiTags('Movie')
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post('add_movie')
  @ApiOperation({ summary: 'Upload a movie' })
  @ApiBody({ type: CreateMovieDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('poster', {
      storage: diskStorage({
        destination: './uploads/posters',
        filename: (req, file, cb) => {
          const avatarName = uuidv4() + extname(file.originalname);
          cb(null, avatarName);
        },
      }),
      fileFilter: (req, file, callback) => {
        let OnlyType = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!OnlyType.includes(file.mimetype)) {
          return callback(
            new UnsupportedMediaTypeException(
              `Uploads Only this Type ${OnlyType}`,
            ),
            false,
          );
        }
        return callback(null, true);
      },
    }),
  )
  @Roles(ROLES.ADMIN, ROLES.SUPERADMIN)
  createMovies(
    @Req() req: Request,
    @Body() createMovieDto: CreateMovieDto,
    @UploadedFile('poster') poster_url: Express.Multer.File,
  ) {
    let user = (req as any).user;
    return this.movieService.createMovies(
      user.user_id,
      createMovieDto,
      poster_url.filename,
    );
  }

  @ApiOperation({ summary: 'Upload a files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateMovieDetailDto })
  @UseInterceptors(
    FileInterceptor('poster', {
      storage: diskStorage({
        destination: './uploads/files',
        filename: (req, file, cb) => {
          const avatarName = uuidv4() + extname(file.originalname);
          cb(null, avatarName);
        },
      }),
      fileFilter: (req, file, callback) => {
        let OnlyType = ['video/mp4', 'video/x-matroska', 'video/webm'];
        if (!OnlyType.includes(file.mimetype)) {
          return callback(
            new UnsupportedMediaTypeException(
              `Uploads Only this Type ${OnlyType}`,
            ),
            false,
          );
        }
        return callback(null, true);
      },
    }),
  )
  @Post('add_files')
  @Roles(ROLES.ADMIN, ROLES.SUPERADMIN)
  createFiles(
    @Body() createMovieDetailDto: CreateMovieDetailDto,
    @UploadedFile('files') files: Express.Multer.File,
  ) {
    return this.movieService.createFiles(createMovieDetailDto, files);
  }

  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: String })
  @ApiQuery({ name: 'categoy', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'subscription_type', required: false, type: String })
  @Get()
  findAll(@Query() query: GetAllMoviesDto) {
    return this.movieService.findAll(query);
  }

  @ApiParam({ name: 'movie_id', required: true, type: String })
  @Get(':movie_id')
  findOne(@Param('movie_id') id: string, @Req() req: Request) {
    return this.movieService.findOne(id, (req as any).user?.user_id);
  }

  @Roles(ROLES.ADMIN, ROLES.SUPERADMIN)
  @ApiOperation({ summary: 'Upload a files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateMovieDto })
  @ApiParam({ name: 'id', required: true, type: String })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.movieService.update(id, updateMovieDto, file.filename);
  }

  @Roles(ROLES.ADMIN, ROLES.SUPERADMIN)
  @ApiParam({ name: 'id', required: true, type: String })
  @Delete(':id')
  removeMovie(@Param('id') id: string) {
    return this.movieService.removeMovie(id);
  }

  @ApiParam({ name: 'id', required: true, type: String })
  @Roles(ROLES.ADMIN, ROLES.SUPERADMIN)
  @Delete(':id')
  removeFile(@Param('id') id: string) {
    return this.movieService.removeFile(id);
  }
}
