import { customAlphabet } from 'nanoid';
// NO DB CALLS OUTSIDE OF QUERIES FUNCTIONS!!!

// Tf does this file do?


// dont have to explain this one
// this is a function to generate a random id for the notes
// frick i explained it anyways damm

// 12 charaacters is a LOT, 3.2262667624E21 possibilities (3226266762400000000000) daaam
// even 5, what I use, is a lot (916,132,832)
// Is this for note ID?
// 8 is common enough leave as is imo 👍

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

export async function generateId(): Promise<string> {
    return nanoid();
}
