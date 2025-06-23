import { db } from '../database.js';
import { notes } from '../db/schema.js';
import { generateId } from '../utils/id.js';
import { eq, lt, isNotNull, and } from 'drizzle-orm';


// a thingy for making new notes
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

// some db staff that prob getting note by id
export async function getNoteById(id: number) {
    const result = await db.select().from(notes).where(eq(notes.id, id));
    return result[0];
}

export async function getNoteByUrl(url: string) {
    const result = await db.select().from(notes).where(eq(notes.url, url));
    return result[0];
}
// this should remove expired notes if i remember correctly
export async function removeExpiredNotes(): Promise<number> {
    const result = await db.delete(notes).where(
        and(isNotNull(notes.expires_at), lt(notes.expires_at, new Date()))
    );
    return result.rowCount ?? 0;
}

