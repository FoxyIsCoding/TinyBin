import {removeExpiredNotes} from './db.js';


export async function loop() {
    console.log("Running note loop check")
    await removeExpiredNotes()
    console.log("Removed old expired notes")
    setTimeout(loop, 1000 * 60 * 5) 
}