/*
Follow a format where you have "queries" functions which interact with the database. No route should ever do DB specific logic on it. It should only be calling the pre made functions
*/

import { db } from '../database.js';
import { notes } from '../db/schema.js';
import { generateId } from '../utils/id.js';
import { eq, lt, isNotNull, and } from 'drizzle-orm';

// Export exports it where you can impot via {create_note}
export async function createNote(title: string, text: string, expiresAt: Date | null = null): Promise<number> {
    const url = await generateId();
    const inserted = await db.insert(notes).values({
        title,
        text,
        url,
        expires_at: expiresAt
    }).returning();
    return inserted[0].id;
}

export async function getNoteById(id: number) {
    const result = await db.select().from(notes).where(eq(notes.id, id));
    return result[0];
}

export async function getNoteByUrl(url: string) {
    const result = await db.select().from(notes).where(eq(notes.url, url));
    return result[0];
}

export async function removeExpiredNotes(): Promise<number> {
    const result = await db.delete(notes).where(
        and(isNotNull(notes.expires_at), lt(notes.expires_at, new Date()))
    );
    return result.rowCount ?? 0;
}

