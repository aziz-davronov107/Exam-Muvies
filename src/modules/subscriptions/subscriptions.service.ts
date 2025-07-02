import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { SubscriptionPlanDto } from './dto/subscription.plan.dto';
import { PurchaseDto } from './dto/purchase.dto';
import { SubscriptionPlan } from 'src/core/models/subscription-plan.model';
import { UserSubscription } from 'src/core/models/user-subscription.model';
import { Payment } from 'src/core/models/payment.model';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectModel(SubscriptionPlan)
    private planModel: typeof SubscriptionPlan,
    @InjectModel(UserSubscription)
    private subModel: typeof UserSubscription,
    @InjectModel(Payment)
    private payModel: typeof Payment,
  ) {}

  async getAll() {
    return this.planModel.findAll({
      where: { name: { [Op.ne]: 'Admin' } },
      include: [
        {
          model: UserSubscription,
          include: [Payment],
        },
      ],
    });
  }

  async createPlan(dto: Required<SubscriptionPlanDto>) {
    return this.planModel.create(dto);
  }

  async changeStatus(id: string, isActive: boolean) {
    const [affected] = await this.planModel.update(
      { is_active: isActive },
      { where: { id } },
    );
    if (!affected) throw new NotFoundException('Plan not found');
    return this.planModel.findByPk(id);
  }

  async purchase(userId: string, dto: PurchaseDto) {
    const plan = await this.planModel.findByPk(dto.plan_id);
    if (!plan) throw new NotFoundException('Subscription plan not found');

    const start = new Date();
    const end = plan.duration_days
      ? new Date(start.getTime() + plan.duration_days * 24 * 60 * 60 * 1000)
      : null;

    const userSub = await this.subModel.create({
      user_id: userId,
      plan_id: dto.plan_id,
      start_date: start,
      end_date: end,
      auto_renew: dto.auto_renew ?? false,
      status: 'active',
    });

    const payment = await this.payModel.create({
      user_subscription_id: userSub.id,
      amount: plan.price,
      status: 'pending',
      external_transfer_id: null,
      payment_method: dto.payment_method,
      payment_details: dto.payment_details,
    });

    return { userSubscription: userSub, payment };
  }
}
