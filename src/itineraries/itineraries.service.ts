import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { type Cache } from 'cache-manager';
import { and, asc, desc, eq, ilike, or, sql, SQL } from 'drizzle-orm';
import { itineraries, itineraryDays } from 'drizzle/migrations/schema';
import { type Dbtype } from 'src/database/database.module';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { ItinerariesSearchDto, SortOption } from './dto/itineraries-search.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';
import { ItinerariesDBService } from './itineraries.db.service';
import {
  invalidateItinerariesCache,
  ITINERARY_CACHE_KEY,
} from './itineraries.util';

@Injectable()
export class ItinerariesService {
  constructor(
    @Inject('DB') private db: Dbtype,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly itinerariesDB: ItinerariesDBService,
  ) {}

  async create(userId: string, createItineraryDto: CreateItineraryDto) {
    try {
      const newItineraries = await this.itinerariesDB.addItineraries(
        userId,
        createItineraryDto,
      );
      if (newItineraries) {
        await this.cacheManager.del(
          `${ITINERARY_CACHE_KEY}:/api/v1/itineraries/*`,
        );
      }

      return { success: true, data: newItineraries };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(userId: string, queryParams: ItinerariesSearchDto) {
    try {
      const { search, category, sort, page, limit, my_itineraries } =
        queryParams;

      let orderBy: SQL<any> | undefined = undefined;

      const conditions: SQL[] = [];
      const offset = (parseInt(page) - 1) * parseInt(limit);

      if (my_itineraries && userId) {
        conditions.push(eq(itineraries.userId, userId));
      } else {
        conditions.push(eq(itineraries.isPublic, true));
      }

      if (search) {
        conditions.push(
          or(
            ilike(itineraries.title, `%${search}%`),
            ilike(itineraries.description, `%${search}%`),
            ilike(itineraries.destination, `%${search}%`),
          ) as SQL,
        );
      }

      if (category && category.toLowerCase() !== 'all') {
        const normalizedCategory = category
          .toLowerCase()
          .replace(/ & /g, '-')
          .replace(/\s+/g, '-');
        conditions.push(eq(itineraries.category, normalizedCategory));
      }

      if (sort) {
        orderBy = this.getSortExpression(sort);
      }

      const data = await this.itinerariesDB.getAllItineraries({
        conditions,
        limit: +limit,
        offset,
        orderBy: orderBy,
      });
      return { success: true, data };
    } catch (error) {
      return new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.itinerariesDB.getSingleItinerary(id);
      return { success: true, data: data };
    } catch (error) {
      return new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updateItineraryDto: UpdateItineraryDto) {
    try {
      await this.db
        .update(itineraries)
        .set({
          title: updateItineraryDto.title,
          destination: updateItineraryDto.description,
          durationDays: updateItineraryDto.duration_days,
          canvasData: JSON.stringify(updateItineraryDto.canvasData),
          updatedAt: sql`NOW()`,
        })
        .where(
          and(
            eq(itineraries.id, id),
            eq(itineraries.userId, process.env.USER_ID!),
          ),
        );

      if (updateItineraryDto.days) {
        for (const day of updateItineraryDto.days) {
          if (day.id && !day.id.startsWith('day-')) {
            await this.db
              .update(itineraryDays)
              .set({
                dayNumber: day.day_number,
                title: day.title,
                description: day.description,
                activities: JSON.stringify(day.activities),
                updatedAt: sql`NOW()`,
              })
              .where(
                and(
                  eq(itineraryDays.id, day.id),
                  eq(itineraryDays.itineraryId, id),
                ),
              );
          } else {
            await this.db.insert(itineraryDays).values({
              id: id,
              dayNumber: day.day_number,
              title: day.title,
              description: day.description,
              activities: JSON.stringify(day.activities),
            });
          }
        }
      }

      await invalidateItinerariesCache(this.cacheManager, id);
      return { success: true };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} itinerary`;
  }

  private getSortExpression(sort?: SortOption) {
    switch (sort) {
      case 'recent':
        return desc(itineraries.createdAt);

      case 'price_low':
        return asc(itineraries.price);

      case 'price_high':
        return desc(itineraries.price);

      case 'rating':
        return desc(itineraries.likeCount);

      case 'trending':
        // custom SQL expression
        return desc(
          sql`${itineraries.viewCount} + ${itineraries.likeCount} * 2`,
        );

      default:
        return desc(itineraries.createdAt); // fallback
    }
  }
}
