// src/subscriptions/subscriptions.controller.ts
import { Controller, Get, Post, Patch, Body, Param, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

import { PurchaseDto } from './dto/purchase.dto';
import { SubscriptionPlanDto } from './dto/subscription.plan.dto';
import { ROLES } from 'src/core/types/enum.types';
import { Roles } from 'src/core/decorators/role.decorators';
import { Public } from 'src/core/decorators/public.decorators';
import { SubscriptionsService } from './subscriptions.service';
import { ChangePlanStatusDto } from './dto/changePlanStatus.dto';

@ApiTags('Subscriptions')
@Controller('subscriptions')
@ApiBearerAuth()
export class SubscriptionsController {
  constructor(private readonly service: SubscriptionsService) {}

  @Get('plans')
  @Public()
  @ApiOperation({ summary: 'Get all subscription plans (no auth)' })
  getAllPlans() {
    return this.service.getAll();
  }

  @Post('plans')
  @Roles(ROLES.ADMIN, ROLES.SUPERADMIN)
  @ApiOperation({ summary: 'Create a new subscription plan' })
  createPlan(@Body() dto: SubscriptionPlanDto) {
    return this.service.createPlan(dto);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: ChangePlanStatusDto })
  @Patch('plans/:id/status')
  @Roles(ROLES.SUPERADMIN)
  @ApiOperation({ summary: 'Activate/deactivate a subscription plan' })
  changePlanStatus(@Param('id') id: string, @Body() dto: ChangePlanStatusDto) {
    return this.service.changeStatus(id, dto.is_active);
  }

  @Post('purchase')
  @Roles(ROLES.USER, ROLES.ADMIN, ROLES.SUPERADMIN)
  @ApiOperation({ summary: 'Purchase a subscription plan' })
  purchase(@Req() req: any, @Body() dto: PurchaseDto) {
    return this.service.purchase(req.user.user_id, dto);
  }
}
