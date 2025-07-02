import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { User } from './user.model';
import { SubscriptionPlan } from './subscription-plan.model';
import { Payment } from './payment.model';
import { USER_SUBSCRIPTION_STATUS } from '../types/enum.types';

@Table({ tableName: 'user_subscriptions' })
export class UserSubscription extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  usersubscriptions_id: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  user_id: string;

  @ForeignKey(() => SubscriptionPlan)
  @Column(DataType.UUID)
  plan_id: string;

  @Default(DataType.NOW)
  @Column(DataType.DATE)
  start_date: Date;

  @Column(DataType.DATE)
  end_date: Date;

  @Column(DataType.ENUM(...Object.values(USER_SUBSCRIPTION_STATUS)))
  status: USER_SUBSCRIPTION_STATUS;

  @Default(false)
  @Column(DataType.BOOLEAN)
  auto_renew: boolean;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => SubscriptionPlan)
  plan: SubscriptionPlan;

  @HasMany(() => Payment, {
    onDelete: 'CASCADE',
    hooks: true,
  })
  payments: Payment[];
}
