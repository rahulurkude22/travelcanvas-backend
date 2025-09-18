import { PartialType } from '@nestjs/mapped-types';
import { CreateQuoteRequestDto } from './create-quote-request.dto';

export class UpdateQuoteRequestDto extends PartialType(CreateQuoteRequestDto) {}
