import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateMarketPlaceDto } from './dto/create-market-place.dto';
import { UpdateMarketPlaceDto } from './dto/update-market-place.dto';
import { itineraries, userProfiles } from 'drizzle/migrations/schema';
import { type Dbtype } from 'src/database/database.module';
import { and, desc, eq, gt, ilike, or, sql, SQL } from 'drizzle-orm';
import { MarketPlaceSearchParams } from './dto/market-place-searchparams.dto';

@Injectable()
export class MarketPlaceService {
  constructor(@Inject('DB') private db: Dbtype) {}
  create(createMarketPlaceDto: CreateMarketPlaceDto) {
    return 'This action adds a new marketPlace';
  }

  async findAll(marketPlaceSearchParams: MarketPlaceSearchParams) {
    try {
      const { category, search, page } = marketPlaceSearchParams;
      const limit = 12;
      const offset = (+page - 1) * limit;
      const conditions: SQL[] = [];

      if (category && category !== 'all') {
        const normalizedCategory = category
          .toLowerCase()
          .replace(/ & /g, '-')
          .replace(/\s+/g, '-');
        conditions.push(eq(itineraries.category, normalizedCategory));
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

      const result = await this.db
        .select({
          id: itineraries.id,
          title: itineraries.title,
          description: itineraries.description,
          price: itineraries.price,
          durationDays: itineraries.durationDays,
          destination: itineraries.destination,
          rating: itineraries.likeCount, // alias
          views: itineraries.viewCount, // alias
          imageUrl: itineraries.thumbnailUrl, // alias
          authorName: userProfiles.fullName,
          authorAvatar: userProfiles.avatarUrl,
        })
        .from(itineraries)
        .innerJoin(userProfiles, eq(itineraries.userId, userProfiles.id))
        .where(
          and(
            eq(itineraries.isPublic, true),
            gt(itineraries.price, '0'),
            ...conditions,
          ),
        )
        .orderBy(desc(itineraries.createdAt))
        .limit(limit)
        .offset(offset);

      const totalCountConditions: SQL[] = [];

      if (category && category !== 'all') {
        const normalizedCategory = category
          .toLowerCase()
          .replace(/ & /g, '-')
          .replace(/\s+/g, '-');
        totalCountConditions.push(eq(itineraries.category, normalizedCategory));
      }

      if (search) {
        totalCountConditions.push(
          or(
            ilike(itineraries.title, `%${search}%`),
            ilike(itineraries.description, `%${search}%`),
            ilike(itineraries.destination, `%${search}%`),
          ) as SQL,
        );
      }

      const [totalCount] = await this.db
        .select({
          total: sql<number>`COUNT(*)`,
        })
        .from(itineraries)
        .where(
          and(
            eq(itineraries.isPublic, true),
            gt(itineraries.price, '0'),
            ...totalCountConditions,
          ),
        );

      return {
        items: result,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount.total / limit),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} marketPlace`;
  }

  update(id: number, updateMarketPlaceDto: UpdateMarketPlaceDto) {
    return `This action updates a #${id} marketPlace`;
  }

  remove(id: number) {
    return `This action removes a #${id} marketPlace`;
  }
}
