import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { and, eq, ilike, or, SQL } from 'drizzle-orm';
import { itineraries, userProfiles } from 'drizzle/migrations/schema';
import { type Dbtype } from 'src/database/database.module';
import { TemplatesSearchParams } from './dto/templates-search-params.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class TemplatesService {
  constructor(@Inject('DB') private db: Dbtype) {}

  async create(templateId: string) {
    try {
      const [template] = await this.db
        .select()
        .from(itineraries)
        .where(
          and(eq(itineraries.id, templateId), eq(itineraries.isPublic, true)),
        );

      if (!template) {
        throw new NotFoundException('Template not found');
      }

      const [newItineraries] = await this.db
        .insert(itineraries)
        .values({
          title: template.title,
          description: template.description,
          destination: template.destination,
          durationDays: template.durationDays,
          userId: process.env.USER_ID!,
          isPublic: true,
          tags: template.tags,
          thumbnailUrl: template.thumbnailUrl,
          canvasData: template.canvasData || JSON.stringify({ elements: [] }),
        })
        .returning();

      return {
        success: true,
        newItinerariesId: newItineraries.id,
        message: 'Template copied successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(queryParams: TemplatesSearchParams) {
    try {
      const { category, search } = queryParams;
      const conditions: SQL[] = [];

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

      const result = await this.db
        .select({
          id: itineraries.id,
          title: itineraries.title,
          description: itineraries.description,
          durationDays: itineraries.durationDays,
          destination: itineraries.destination,
          rating: itineraries.likeCount,
          views: itineraries.viewCount,
          imageUrl: itineraries.thumbnailUrl,
          tags: itineraries.tags,
          authorName: userProfiles.fullName,
          authorAvatar: userProfiles.avatarUrl,
        })
        .from(itineraries)
        .innerJoin(userProfiles, eq(itineraries.userId, userProfiles.id))
        .where(
          and(
            eq(itineraries.isPublic, true),
            eq(itineraries.isTemplate, true),
            ...conditions,
          ),
        );
      return { success: true, templates: result };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} template`;
  }

  update(id: number, updateTemplateDto: UpdateTemplateDto) {
    return `This action updates a #${id} template`;
  }

  remove(id: number) {
    return `This action removes a #${id} template`;
  }
}
