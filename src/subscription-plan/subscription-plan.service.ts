import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';
import { SubscriptionPlanSearchParams } from './dto/subscription-plan-search-params.dto';
import { type Dbtype } from 'src/database/database.module';
import { subscriptionPlans } from 'drizzle/migrations/schema';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class SubscriptionPlanService {
  constructor(@Inject('DB') private db: Dbtype) {}
  create(createSubscriptionPlanDto: CreateSubscriptionPlanDto) {
    return 'This action adds a new subscriptionPlan';
  }

  async findAll(subscriptionPlanQUeryParams: SubscriptionPlanSearchParams) {
    const { billingInterval } = subscriptionPlanQUeryParams;
    try {
      const plans = await this.db
        .select()
        .from(subscriptionPlans)
        .where(
          and(
            eq(subscriptionPlans.isActive, true),
            eq(subscriptionPlans.billingInterval, billingInterval),
          ),
        );

      return { success: true, plans };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} subscriptionPlan`;
  }

  update(id: number, updateSubscriptionPlanDto: UpdateSubscriptionPlanDto) {
    return `This action updates a #${id} subscriptionPlan`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscriptionPlan`;
  }
}
