/*
Follow a format where you have "queries" functions which interact with the database. No route should ever do DB specific logic on it. It should only be calling the pre made functions
*/

import { db } from '../db/index.js';
import { notes } from '../db/schema.js';
import { genID } from '../backend/url.js';
import { eq, lt, isNotNull, and } from 'drizzle-orm';

// Export exports it where you can impot via {create_note}
export async function create_note(title: string, text: string, expiresAt: Date | null = null): Promise<string> {
      const url = await genID();
      const inserted = await db.insert(notes).values({
        title,
        text,
        expiresAt,
        url,
      }).returning({ id: notes.id });
    
      console.log('📎 | Added new note with id ' + inserted[0]?.id);
      return String(inserted[0]?.id);
};

export async function get_note_by_id(id: string) {
  const result = await db.select().from(notes).where(eq(notes.id, parseInt(id)));
  return result[0];
}

export async function get_note_by_url(url: string) {
  const result = await db.select().from(notes).where(eq(notes.url, url));
  return result[0];
}

export async function removeExpiredNotes() {
  const result = await db.delete(notes).where(
    and(isNotNull(notes.expiresAt), lt(notes.expiresAt, new Date()))
  );
  return result.rowCount ?? 0;
}

