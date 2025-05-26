import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  text: text('text').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  expires_at: timestamp('expires_at'),
  url: varchar('url', { length: 32 }).notNull().unique(),
});
