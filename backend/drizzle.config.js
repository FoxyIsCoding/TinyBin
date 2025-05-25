import config from './src/config.ts';


import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    database_url: config.database_url
  },
});
// The db already ensures the type of that entry, no need to parse int