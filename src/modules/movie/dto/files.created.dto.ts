import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { LANGUAGE, MOVIE_QUALITY } from 'src/core/types/enum.types';

export class CreateMovieDetailDto {
  @IsEnum(MOVIE_QUALITY)
  quality: MOVIE_QUALITY;

  @IsEnum(LANGUAGE)
  @IsOptional()
  language?: LANGUAGE;

  @IsUUID()
  movie_id: string;
}
