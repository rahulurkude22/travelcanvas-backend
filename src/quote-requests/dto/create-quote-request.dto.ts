import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateQuoteRequestDto {
  @IsOptional()
  @IsString()
  itineraryId: string;

  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber: string = '';

  @IsString()
  travelStartDate: string;

  @IsOptional()
  @IsString()
  travelEndDate: string = '';

  @IsOptional()
  @IsString()
  numberOfTravelers: string = '1';

  @IsOptional()
  @IsString()
  tourCategory: string;

  @IsOptional()
  @IsString()
  specialRequirements: string;

  @IsOptional()
  @IsString()
  budgetRange: string;

  @IsOptional()
  @IsString()
  accommodationPreference: string;
}
