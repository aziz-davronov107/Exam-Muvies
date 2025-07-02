import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Category } from './category.model';
import { Review } from './review.model';
import { MovieFile } from './movie-file.model';
import { Favorite } from './favorite.model';
import { WatchHistory } from './watch-history.model';
import { SUBSCRIPTION_TYPE } from '../types/enum.types';

@Table({ tableName: 'movies' })
export class Movie extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  movie_id: string;

  @Column({ type: DataType.STRING })
  title: string;

  @Column({ type: DataType.STRING, unique: true })
  slug: string;

  @Column(DataType.TEXT)
  description: string;

  @Column(DataType.INTEGER)
  release_year: number;

  @Column(DataType.INTEGER)
  duration_minutes: number;

  @Column({ type: DataType.STRING })
  poster_url: string;

  @Column({ type: DataType.DECIMAL(3, 1), defaultValue: null })
  rating: number;
  @Column({
    type: DataType.ENUM(...Object.values(SUBSCRIPTION_TYPE)),
    defaultValue: SUBSCRIPTION_TYPE.FREE,
  })
  subscription_type: SUBSCRIPTION_TYPE;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  view_count: number;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  created_by: string;

  @ForeignKey(() => Category)
  @Column(DataType.UUID)
  category_id: string;
  @BelongsTo(() => User)
  creator: User;

  @BelongsTo(() => Category)
  category: Category;

  @HasMany(() => Review, { onDelete: 'CASCADE', hooks: true })
  reviews: Review[];

  @HasMany(() => MovieFile, { onDelete: 'CASCADE', hooks: true })
  movieFiles: MovieFile[];

  @HasMany(() => Favorite, { onDelete: 'CASCADE', hooks: true })
  favorites: Favorite[];

  @HasMany(() => WatchHistory, { onDelete: 'CASCADE', hooks: true })
  watchHistories: WatchHistory[];
}
