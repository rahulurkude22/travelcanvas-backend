import { IsString } from 'class-validator';

export class QuoteRequestsSearchParms {
  @IsString()
  status: string;
}
