import { IsOptional, IsString } from 'class-validator';

export class MarketPlaceSearchParams {
  @IsOptional()
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  page: string = '1';
}
