import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Category } from './category.model';

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

  @Column(DataType.DECIMAL(3, 1))
  rating: number;

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
}
