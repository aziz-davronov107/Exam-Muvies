import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionPlan } from 'src/core/models/subscription-plan.model';
import { UserSubscription } from 'src/core/models/user-subscription.model';
import { Payment } from 'src/core/models/payment.model';

@Module({
  imports: [
    SequelizeModule.forFeature([SubscriptionPlan, UserSubscription, Payment]),
  ],
  providers: [SubscriptionsService],
  controllers: [SubscriptionsController],
})
export class SubscriptionsModule {}
