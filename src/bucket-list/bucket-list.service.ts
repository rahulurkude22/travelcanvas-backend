import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateBucketListDto } from './dto/create-bucket-list.dto';
import { UpdateBucketListDto } from './dto/update-bucket-list.dto';
import { type Dbtype } from 'src/database/database.module';
import {
  itineraries,
  userBucketLists,
  userProfiles,
} from 'drizzle/migrations/schema';
import { and, desc, eq, sql } from 'drizzle-orm';

@Injectable()
export class BucketListService {
  constructor(@Inject('DB') private db: Dbtype) {}
  async create(createBucketListDto: CreateBucketListDto) {
    try {
      await this.db
        .insert(userBucketLists)
        .values({
          userId: process.env.USER_ID!,
          itineraryId: createBucketListDto.itineraryId,
          addedAt: sql`NOW()`,
        })
        .onConflictDoNothing();

      return { success: true };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    return 'This action adds a new bucketList';
  }

  async findAll() {
    try {
      const bucketList = await this.db
        .select({
          id: userBucketLists.id,
          addedAt: userBucketLists.addedAt,
          notes: userBucketLists.notes,
          itineraryId: itineraries.id,
          title: itineraries.title,
          description: itineraries.description,
          destination: itineraries.destination,
          durationDays: itineraries.durationDays,
          thumbnailUrl: itineraries.thumbnailUrl,
          price: itineraries.price,
          currency: itineraries.currency,
          tags: itineraries.tags,
          authorName: userProfiles.fullName,
          authorRole: userProfiles.role,
        })
        .from(userBucketLists)
        .innerJoin(itineraries, eq(userBucketLists.itineraryId, itineraries.id))
        .innerJoin(userProfiles, eq(itineraries.userId, userProfiles.id))
        .where(
          and(
            eq(userBucketLists.userId, process.env.USER_ID!),
            eq(itineraries.isPublic, true),
          ),
        )
        .orderBy(desc(userBucketLists.addedAt));

      const formattedBucketList = bucketList.map((item) => ({
        id: item.id,
        added_at: item.addedAt,
        notes: item.notes,
        itinerary: {
          id: item.itineraryId,
          title: item.title,
          description: item.description,
          destination: item.destination,
          duration_days: item.durationDays,
          thumbnail_url: item.thumbnailUrl,
          price: item.price,
          currency: item.currency,
          tags: item.tags,
          author: {
            name: item.authorName,
            role: item.authorRole,
          },
        },
      }));

      return { success: true, bucketList: formattedBucketList };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} bucketList`;
  }

  update(id: number, updateBucketListDto: UpdateBucketListDto) {
    return `This action updates a #${id} bucketList`;
  }

  async remove(itineraryId: string) {
    try {
      if (!itineraryId) {
        throw new BadRequestException('Itinerary ID is required');
      }

      await this.db
        .delete(userBucketLists)
        .where(
          and(
            eq(userBucketLists.userId, process.env.USER_ID!),
            eq(userBucketLists.itineraryId, itineraryId),
          ),
        );

      return { success: true };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
