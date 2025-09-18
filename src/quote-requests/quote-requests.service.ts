import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { and, desc, eq, SQL } from 'drizzle-orm';
import { itineraries, quoteRequests } from 'drizzle/migrations/schema';
import { type Dbtype } from 'src/database/database.module';
import { CreateQuoteRequestDto } from './dto/create-quote-request.dto';
import { QuoteRequestsSearchParms } from './dto/search-params.dto';
import { UpdateQuoteRequestDto } from './dto/update-quote-request.dto';

@Injectable()
export class QuoteRequestsService {
  constructor(@Inject('DB') private readonly db: Dbtype) {}
  async create(createQuoteRequestDto: CreateQuoteRequestDto) {
    try {
      const {
        itineraryId,
        accommodationPreference,
        budgetRange,
        email,
        fullName,
        numberOfTravelers,
        phoneNumber,
        specialRequirements,
        tourCategory,
        travelEndDate,
        travelStartDate,
      } = createQuoteRequestDto;

      if (!fullName || !email) {
        throw new BadRequestException('Full name and email are required');
      }

      const result = await this.db
        .insert(quoteRequests)
        .values({
          userId: process.env.USER_ID!,
          itineraryId: itineraryId || null,
          fullName,
          email,
          phoneNumber: phoneNumber || '',
          travelStartDate: travelStartDate || '',
          travelEndDate: travelEndDate || '',
          specialRequirements: specialRequirements || '',
          budgetRange: budgetRange || '',
          accommodationPreference: accommodationPreference || '',
          numberOfTravelers: +numberOfTravelers || 1,
          tourCategory: tourCategory || '',
        })
        .returning();

      return {
        success: true,
        quoteRequest: result,
        message: 'Quote request submitted successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(queryParams: QuoteRequestsSearchParms) {
    try {
      const { status } = queryParams;
      const conditions: SQL[] = [];

      if (status) {
        conditions.push(eq(quoteRequests.status, status));
      }

      const result = await this.db
        .select({
          quoteRequests: quoteRequests,
          itineraryTitle: itineraries.title,
          itineraryDestination: itineraries.destination,
        })
        .from(quoteRequests)
        .leftJoin(itineraries, eq(quoteRequests.itineraryId, itineraries.id))
        .where(
          and(eq(quoteRequests.userId, process.env.USER_ID!), ...conditions),
        )
        .orderBy(desc(quoteRequests.createdAt));
      return { success: true, quoteRequests: result };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} quoteRequest`;
  }

  update(id: number, updateQuoteRequestDto: UpdateQuoteRequestDto) {
    return `This action updates a #${id} quoteRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} quoteRequest`;
  }
}
