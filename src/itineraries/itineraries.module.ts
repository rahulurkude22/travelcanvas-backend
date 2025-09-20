import { Module } from '@nestjs/common';
import { ItinerariesService } from './itineraries.service';
import { ItinerariesController } from './itineraries.controller';
import { ItinerariesDBService } from './itineraries.db.service';

@Module({
  controllers: [ItinerariesController],
  providers: [ItinerariesService, ItinerariesDBService],
})
export class ItinerariesModule {}
