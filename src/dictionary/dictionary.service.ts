import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { categories, destinations } from 'drizzle/migrations/schema';
import { type Dbtype } from 'src/database/database.module';

@Injectable()
export class DictionaryService {
  constructor(@Inject('DB') private readonly db: Dbtype) {}

  async getAllMetaData() {
    try {
      const allCategories = await this.db.select().from(categories);
      const allDestination = await this.db.select().from(destinations);
      return { success: true, data: { allCategories, allDestination } };
    } catch (error) {
      throw new InternalServerErrorException(error.response.data.errorMessage);
    }
  }
}
