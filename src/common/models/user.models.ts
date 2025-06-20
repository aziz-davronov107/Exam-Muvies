import { DataTypes } from 'sequelize';
import { Table, Model, Column } from 'sequelize-typescript';
import { Roles } from 'src/core/types/role';

@Table({
  tableName: 'users',
})
export class User extends Model {
  @Column
  username: string;

  @Column
  email: string;

  @Column
  password: string;

  @Column({
    type: DataTypes.ENUM(...Object.values(Roles)),
    defaultValue: Roles.USER,
  })
  role: Roles;
}
