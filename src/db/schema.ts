import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  text: text('text').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at'),
  url: varchar('url', { length: 32 }).notNull().unique(),
});
