import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
} from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UseInterceptors,
} from '@nestjs/common';
import { type Cache } from 'cache-manager';
import { and, asc, desc, eq, ilike, or, sql, SQL } from 'drizzle-orm';
import { itineraries, itineraryDays } from 'drizzle/migrations/schema';
import { type Dbtype } from 'src/database/database.module';
import { CreateItineraryDto } from './dto/create-itinerary.dto';
import { ItinerariesSearchDto, SortOption } from './dto/itineraries-search.dto';
import { UpdateItineraryDto } from './dto/update-itinerary.dto';

@Injectable()
@UseInterceptors(CacheInterceptor)
export class ItinerariesService {
  constructor(
    @Inject('DB') private db: Dbtype,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createItineraryDto: CreateItineraryDto) {
    try {
      const { title, description, destination, duration_days } =
        createItineraryDto;

      const [newItineraries] = await this.db
        .insert(itineraries)
        .values({
          title,
          description,
          destination,
          durationDays: duration_days,
        })
        .returning({ id: itineraries.id });

      await this.db.insert(itineraryDays).values({
        itineraryId: newItineraries.id,
        dayNumber: 1,
        title: 'Day 1',
        description: '',
        activities: [],
        createdAt: JSON.stringify(sql`NOW()`),
      });

      return { success: true, data: newItineraries };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @CacheKey('itineraries_list')
  @CacheTTL(120) // cache 2 minutes
  async findAll(queryParams: ItinerariesSearchDto) {
    try {
      const { search, category, sort, page, limit, my_itineraries } =
        queryParams;
      console.log(my_itineraries);
      let orderBy: SQL<unknown> | undefined = undefined;
      const conditions: SQL[] = [];
      const offset = (parseInt(page) - 1) * parseInt(limit);
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
      if (my_itineraries) {
        console.log(typeof my_itineraries);
        conditions.push(
          eq(itineraries.id, '43be3b76-faeb-4946-bf9b-68fd4022c10f'),
        );
      }

      if (sort) {
        orderBy = this.getSortExpression(sort);
      }

      const data = await this.db.query.itineraries.findMany({
        where: conditions.length ? and(...conditions) : undefined,
        limit: +limit,
        offset,
        orderBy,
      });

      return { success: true, data };
    } catch (error) {
      return new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.db.query.itineraries.findFirst({
        where: eq(itineraries.id, id),
      });

      return { success: true, data };
    } catch (error) {
      return new InternalServerErrorException(error.message);
    }
    return {};
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

      return { success: true };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    return {};
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
