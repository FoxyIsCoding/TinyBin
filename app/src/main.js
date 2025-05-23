import dotenv from 'dotenv';
dotenv.config()

import { connectDb, getNoteById, removeExpiredNotes, addNote } from './backend/db.js';
import { loop } from './backend/loop.js';
import { startWebServer } from './backend/web.js';
//setup and load all shits
async function start() {
  console.log('⌚ | Starting application...')
  console.log("🆕 | Starting db")
  await connectDb()
  await startupCheck()
  console.log("🆕 | Starting web server")
  await startWebServer()
  console.log("🆕 | Starting note loop")
  await loop()
}


async function startupCheck() {
  await removeExpiredNotes()
  console.log("🧰 | Removed old expired notes")

}

start()