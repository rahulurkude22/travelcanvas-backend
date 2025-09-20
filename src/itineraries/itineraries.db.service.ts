import { Inject, Injectable } from '@nestjs/common';
import { and, eq, SQL } from 'drizzle-orm';
import { itineraries, itineraryDays } from 'drizzle/migrations/schema';
import { type Dbtype } from 'src/database/database.module';
import { CreateItineraryDto } from './dto/create-itinerary.dto';

type Column = keyof typeof itineraries;

type getAllOptions = {
  conditions?: SQL[];
  limit?: number;
  offset?: number;
  orderBy?: SQL<Column>;
};

@Injectable()
export class ItinerariesDBService {
  constructor(@Inject('DB') private readonly db: Dbtype) {}

  async addItineraries(userId: string, addOptions: CreateItineraryDto) {
    return await this.db.transaction(async (tx) => {
      const [newItineraries] = await tx
        .insert(itineraries)
        .values({
          userId,
          title: addOptions.title,
          description: addOptions.description,
          destination: addOptions.destination,
          durationDays: addOptions.duration_days,
        })
        .returning();

      if (!newItineraries) {
        tx.rollback();
        return;
      }

      return await tx
        .insert(itineraryDays)
        .values({
          itineraryId: newItineraries.id,
          dayNumber: 1,
          title: 'Day 1',
          description: '',
          activities: [],
          // createdAt: JSON.stringify(sql`NOW()`),
        })
        .returning();
    });
  }

  getAllItineraries({
    conditions = [],
    limit = 10,
    offset = 0,
    orderBy,
  }: getAllOptions) {
    return this.db.query.itineraries.findMany({
      where: conditions?.length ? and(...conditions) : undefined,
      limit: limit,
      offset,
      orderBy,
    });
  }

  getSingleItinerary(itineraryId: string) {
    return this.db.query.itineraries.findFirst({
      where: eq(itineraries.id, itineraryId),
    });
  }
}
