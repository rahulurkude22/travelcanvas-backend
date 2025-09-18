import { IsOptional, IsString } from 'class-validator';

export class SubscriptionPlanSearchParams {
  @IsOptional()
  @IsString()
  billingInterval: string = 'monthly';
}
