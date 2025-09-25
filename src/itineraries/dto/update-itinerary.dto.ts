import { PartialType } from '@nestjs/mapped-types';
import { CreateItineraryDto } from './create-itinerary.dto';
import { IsOptional } from 'class-validator';

interface day {
  id: string;
  day_number: number;
  title: string;
  description: string;
  activities: string;
}

export class UpdateItineraryDto extends PartialType(CreateItineraryDto) {
  @IsOptional()
  days: [day];
}
