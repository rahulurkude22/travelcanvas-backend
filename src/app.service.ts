import { Inject, Injectable } from '@nestjs/common';
import {} from 'drizzle-orm';
import type { Dbtype } from './database/database.module';
import { itineraries } from 'drizzle/migrations/schema';

@Injectable()
export class AppService {
  constructor(@Inject('DB') private db: Dbtype) {}
  async getHello() {
    const result = await this.db.select().from(itineraries);
    return result;
  }
}
