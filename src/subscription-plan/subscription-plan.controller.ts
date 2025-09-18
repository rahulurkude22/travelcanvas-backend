import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SubscriptionPlanService } from './subscription-plan.service';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';
import { SubscriptionPlanSearchParams } from './dto/subscription-plan-search-params.dto';

@Controller('subscription-plan')
export class SubscriptionPlanController {
  constructor(
    private readonly subscriptionPlanService: SubscriptionPlanService,
  ) {}

  @Post()
  create(@Body() createSubscriptionPlanDto: CreateSubscriptionPlanDto) {
    return this.subscriptionPlanService.create(createSubscriptionPlanDto);
  }

  @Get()
  findAll(@Query() subscriptionPlanQUeryParams: SubscriptionPlanSearchParams) {
    return this.subscriptionPlanService.findAll(subscriptionPlanQUeryParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionPlanService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionPlanDto: UpdateSubscriptionPlanDto,
  ) {
    return this.subscriptionPlanService.update(+id, updateSubscriptionPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriptionPlanService.remove(+id);
  }
}
