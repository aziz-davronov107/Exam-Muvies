import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Movie } from './movie.model';
import { LANGUAGE, MOVIE_QUALITY } from '../types/enum.types';

@Table({ tableName: 'movie_files' })
export class MovieFile extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  moviefiles_id: string;

  @ForeignKey(() => Movie)
  @Column(DataType.UUID)
  movie_id: string;

  @Column(DataType.ENUM(...Object.values(MOVIE_QUALITY)))
  quality: MOVIE_QUALITY;

  @Default(LANGUAGE.UZ)
  @Column(DataType.STRING)
  language: LANGUAGE;

  @BelongsTo(() => Movie)
  movie: Movie;
}
