import { Global, Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as dbSchema from 'drizzle/migrations/schema';
import * as keyClockSchema from 'drizzle/keycloak/schema';
import { Pool } from 'pg';

export type Dbtype = NodePgDatabase<typeof dbSchema>;
export type keycloakDbtype = NodePgDatabase<typeof keyClockSchema>;

@Global()
@Module({
  providers: [
    {
      provide: 'DB_POOL',
      inject: [ConfigService],
      useFactory: (config: ConfigService): Pool => {
        return new Pool({
          connectionString: config.get<string>('DATABASE_URL'),
          max: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        });
      },
    },
    {
      provide: 'DB',
      inject: ['DB_POOL'],
      useFactory: (pool: Pool): Dbtype => drizzle(pool, { schema: dbSchema }),
    },
    {
      provide: 'KEYCLOAK_POOL',
      inject: [ConfigService],
      useFactory: (config: ConfigService): Pool => {
        return new Pool({
          connectionString: config.get<string>('KEYCLOACK_DATABASE_URL'),
          max: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        });
      },
    },
    {
      provide: 'KEYCLOAK_DB',
      inject: ['KEYCLOAK_POOL'],
      useFactory: (pool: Pool): keycloakDbtype =>
        drizzle(pool, { schema: keyClockSchema }),
    },
  ],
  exports: ['DB', 'KEYCLOAK_DB'],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(
    @Inject('DB_POOL') private readonly dbPool: Pool,
    @Inject('KEYCLOAK_POOL') private readonly keycloakPool: Pool,
  ) {}
  async onModuleDestroy() {
    await this.dbPool.end();
    await this.keycloakPool.end();
  }
}
