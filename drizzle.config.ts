import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/database/schema.ts', // where your DB schema lives
  out: './drizzle/migrations', // migration output folder
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!, // stored in .env
  },
});
