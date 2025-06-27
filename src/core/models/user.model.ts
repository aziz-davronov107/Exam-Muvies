import {Table, Column, Model, DataType, Default, Unique, HasMany} from 'sequelize-typescript';
import { UserSubscription } from './user-subscription.model';
import { Favorite } from './favorite.model';
import { Review } from './review.model';
import { WatchHistory } from './watch-history.model';
import { Movie } from './movie.model';
import { ROLES } from '../types/enum.types';


@Table({ tableName: 'users' })
export class User extends Model {
  @Column({ type: DataType.UUID, primaryKey: true, defaultValue: DataType.UUIDV4 ,field: 'user_id'})
  user_id: string;

  @Unique @Column({ type: DataType.STRING })
  username: string;

  @Unique @Column({ type: DataType.STRING })
  email: string;

  @Column({ type: DataType.STRING })
  password: string;

  @Default(ROLES.USER) @Column(DataType.ENUM(...Object.values(ROLES)))
  role: ROLES;

  @Column({ type: DataType.STRING })
  avatar_url: string;

  @Column({ type: DataType.UUID })
  profile_id: string;

  @Column({ type: DataType.STRING })
  full_name: string;

  @Column({ type: DataType.STRING })
  phone: string;

  @Column({ type: DataType.STRING })
  country: string;

  @HasMany(() => UserSubscription)
  subscriptions: UserSubscription[];

  @HasMany(() => Favorite)
  favorites: Favorite[];

  @HasMany(() => Review)
  reviews: Review[];

  @HasMany(() => WatchHistory)
  watchHistory: WatchHistory[];

  @HasMany(() => Movie)
  movies: Movie[];
}