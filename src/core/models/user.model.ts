import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  Unique,
  HasMany,
} from 'sequelize-typescript';
import { UserSubscription } from './user-subscription.model';
import { Favorite } from './favorite.model';
import { Review } from './review.model';
import { WatchHistory } from './watch-history.model';
import { Movie } from './movie.model';
import { ROLES } from '../types/enum.types';

@Table({ tableName: 'users' })
export class User extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    field: 'user_id',
  })
  user_id: string;

  @Unique
  @Column({ type: DataType.STRING })
  username: string;

  @Unique
  @Column({ type: DataType.STRING })
  email: string;

  @Column({ type: DataType.STRING })
  password: string;

  @Default(ROLES.USER)
  @Column(DataType.ENUM(...Object.values(ROLES)))
  role: ROLES;

  @Column({ type: DataType.STRING, defaultValue: null })
  avatar_url: string;

  @Column({ type: DataType.STRING, defaultValue: null })
  full_name: string;

  @Column({ type: DataType.STRING, defaultValue: null })
  phone: string;

  @Column({ type: DataType.STRING, defaultValue: null })
  country: string;

  @HasMany(() => UserSubscription, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  subscriptions: UserSubscription[];

  @HasMany(() => Favorite, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  favorites: Favorite[];

  @HasMany(() => Review, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  reviews: Review[];

  @HasMany(() => WatchHistory, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  watchHistory: WatchHistory[];

  @HasMany(() => Movie, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  movies: Movie[];
}
