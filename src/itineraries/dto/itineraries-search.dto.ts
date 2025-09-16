// dto/itineraries-search.dto.ts
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
export type SortOption =
  | 'latest'
  | 'recent'
  | 'price_low'
  | 'price_high'
  | 'rating'
  | 'trending';
export class ItinerariesSearchDto {
  @IsOptional()
  @IsString()
  search: string = '';

  @IsOptional()
  @IsString()
  category: string = 'all';

  @IsOptional()
  @IsString()
  sort: SortOption = 'latest';

  @IsOptional()
  @IsString()
  page: string = '1';

  @IsOptional()
  @IsString()
  limit: string = '10';

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === 1)
  my_itineraries: boolean = false;
}
