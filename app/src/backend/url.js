import { randomBytes } from 'crypto';
import { connectDb } from './db.js';


// dont have to explain this one
// this is a function to generate a random id for the notes
// frick i explained it anyways damm
export async function genID(length = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    let exists = true;
    const conn = await connectDb();

    while (exists) {
        result = '';
        const bytes = randomBytes(length);
        for (let i = 0; i < bytes.length && result.length < length; i++) {
            const index = bytes[i] % chars.length;
            result += chars[index];
        }
        
        const [rows] = await conn.execute(
            'SELECT 1 FROM notes WHERE url = ? LIMIT 1',
            [result]
        );
        exists = rows.length > 0;
    }
    return result;
}
