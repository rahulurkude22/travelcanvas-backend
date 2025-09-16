import { Global, Module } from '@nestjs/common';
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
        });

        return drizzle(pool, { schema });
      },
    },
  ],
  exports: ['DB'],
})
export class DatabaseModule {}
