import { Inject, Injectable } from '@nestjs/common';
import { and, eq, SQL } from 'drizzle-orm';
import { itineraries, itineraryDays } from 'drizzle/migrations/schema';
import { type Dbtype } from 'src/database/database.module';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';

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
    return this.db
      .select()
      .from(itineraries)
      .where(eq(itineraries.id, itineraryId));
  }

  async updateItinerary(
    userId: string,
    itineraryId: string,
    updateOptions: UpdateItineraryDto,
  ) {
    return await this.db.transaction(async (tx) => {
      await tx
        .update(itineraries)
        .set({
          title: updateOptions.title,
          destination: updateOptions.description,
          durationDays: updateOptions.duration_days,
          canvasData: JSON.stringify(updateOptions.canvasData),
        })
        .where(
          and(eq(itineraries.id, itineraryId), eq(itineraries.userId, userId)),
        );

      if (updateOptions.days) {
        for (const day of updateOptions.days) {
          if (day.id && !day.id.startsWith('day-')) {
            await this.db
              .update(itineraryDays)
              .set({
                dayNumber: day.day_number,
                title: day.title,
                description: day.description,
                activities: JSON.stringify(day.activities),
              })
              .where(
                and(
                  eq(itineraryDays.id, day.id),
                  eq(itineraryDays.itineraryId, itineraryId),
                ),
              );
          } else {
            await this.db.insert(itineraryDays).values({
              id: itineraryId,
              dayNumber: day.day_number,
              title: day.title,
              description: day.description,
              activities: JSON.stringify(day.activities),
            });
          }
        }
      }
    });
  }
}
