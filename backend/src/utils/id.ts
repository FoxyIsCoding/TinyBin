import crypto from "node:crypto"
// NO DB CALLS OUTSIDE OF QUERIES FUNCTIONS!!!

// Tf does this file do?


// dont have to explain this one
// this is a function to generate a random id for the notes
// frick i explained it anyways damm

// 12 charaacters is a LOT, 3.2262667624E21 possibilities (3226266762400000000000) daaam
// even 5, what I use, is a lot (916,132,832)
// Is this for note ID?
// 8 is common enough leave as is imo 👍

export async function generateNoteId() {
    return crypto.getRandomValues(new Uint32Array(1))[0].toString(8); // Returns smth like: 47525620
}
