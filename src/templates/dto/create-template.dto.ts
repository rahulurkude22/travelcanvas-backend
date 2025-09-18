import { IsString } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  description: string;
  destination: string;
  duration_days: string;
  id: string;
  tags: string;
  thumbnail_url: string;
  canvas_data: string;
}
