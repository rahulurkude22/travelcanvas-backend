import { Module } from '@nestjs/common';
import { QuoteRequestsService } from './quote-requests.service';
import { QuoteRequestsController } from './quote-requests.controller';

@Module({
  controllers: [QuoteRequestsController],
  providers: [QuoteRequestsService],
})
export class QuoteRequestsModule {}
