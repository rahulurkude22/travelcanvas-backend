import { Global, Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from 'drizzle/migrations/schema';

export type Dbtype = NodePgDatabase<typeof schema>;

@Global()
@Module({
  providers: [
    {
      provide: 'DB',
      inject: [ConfigService],
      useFactory: (config: ConfigService): Dbtype => {
        const pool = new Pool({
          connectionString: config.get<string>('DATABASE_URL'),
          max: 10, // sensible default (depends on your Postgres instance size)
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        });

        return drizzle(pool, { schema });
      },
    },
  ],
  exports: ['DB'],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(@Inject('DB') private readonly db: any) {}
  async onModuleDestroy() {
    if (this.db?.pool) {
      await this.db.pool.end();
    }
  }
}
