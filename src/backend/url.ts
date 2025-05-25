import { randomBytes } from 'crypto';
import { db } from '../db/index.js';
import { notes } from '../db/schema.js';
import { eq } from 'drizzle-orm';


// dont have to explain this one
// this is a function to generate a random id for the notes
// frick i explained it anyways damm
export async function genID(length = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    let exists = true;

    while (exists) {
        result = '';
        const bytes = randomBytes(length);
        for (let i = 0; i < bytes.length && result.length < length; i++) {
            const index = bytes[i] % chars.length;
            result += chars[index];
        }
        
        const existing = await db.select().from(notes).where(eq(notes.url, result));
        exists = existing.length > 0;
    }
    return result;
}
