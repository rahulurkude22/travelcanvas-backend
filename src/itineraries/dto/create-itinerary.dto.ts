import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateItineraryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsInt()
  @Min(1)
  duration_days: number;

  @IsString()
  @IsOptional()
  description: string;
}
