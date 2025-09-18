import { IsOptional, IsString } from 'class-validator';

export class TemplatesSearchParams {
  @IsOptional()
  @IsString()
  category: string;
  search: string;
}
