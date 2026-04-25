import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Tell Drizzle to ONLY manage these specific tables and ignore all of your existing data
  // tablesFilter: ['users', 'roles'],
});