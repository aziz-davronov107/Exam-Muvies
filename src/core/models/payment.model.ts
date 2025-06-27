import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { UserSubscription } from './user-subscription.model';
import { PAYMENT_METHOD } from '../types/enum.types';

@Table({ tableName: 'payments' })
export class Payment extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  payment_id: string;

  @ForeignKey(() => UserSubscription)
  @Column(DataType.UUID)
  user_subscription_id: string;

  @Column({ type: DataType.DECIMAL(10, 2) })
  amount: number;

  @Column(DataType.ENUM(...Object.values(PAYMENT_METHOD)))
  payment_method: PAYMENT_METHOD;

  @Column(DataType.JSON)
  payment_details: object;

  @Column(DataType.ENUM(...Object.values(PAYMENT_METHOD)))
  status: PAYMENT_METHOD;

  @Column({ type: DataType.STRING })
  external_transaction_id: string;

  @BelongsTo(() => UserSubscription)
  user_subscription: UserSubscription;
}
