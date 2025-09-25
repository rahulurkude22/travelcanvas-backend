import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { type Cache } from 'cache-manager';
import {
  and,
  asc,
  desc,
  eq,
  ilike,
  isNotNull,
  or,
  sql,
  SQL,
} from 'drizzle-orm';
import { itineraries } from 'drizzle/migrations/schema';
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
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(userId: string | null, queryParams: ItinerariesSearchDto) {
    try {
      const { search, category, sort, page, limit, my_itineraries } =
        queryParams;

      // console.log({ userId });
      if (my_itineraries && !userId) {
        return new UnauthorizedException('Unauthorized Access.');
      }

      let orderBy: SQL<any> | undefined = undefined;

      const conditions: SQL[] = [];
      const offset = (parseInt(page) - 1) * parseInt(limit);

      if (my_itineraries && userId) {
        const userCondition = and(
          userId ? eq(itineraries.userId, userId) : undefined,
          isNotNull(itineraries.userId),
        );
        if (userCondition) {
          conditions.push(userCondition);
        }
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
      return new InternalServerErrorException(error.response.data.errorMessage);
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

  async update(
    userId: string,
    id: string,
    updateItineraryDto: UpdateItineraryDto,
  ) {
    try {
      await this.itinerariesDB.updateItinerary(userId, id, updateItineraryDto);
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
