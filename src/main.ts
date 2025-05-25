import dotenv from 'dotenv';
dotenv.config();
import { removeExpiredNotes } from './queries/notes.js';
import { db, sql } from './db/index.js';
import { loop } from './backend/loop.js';
import { startWebServer } from './backend/web.js';


// Setup and load all components
async function start() {
  try {
    console.log('⌚ | Starting application...');
    
    // Test database connection
    await db.execute(sql`SELECT 1`);
    console.log("🆕 | Database connected successfully");
    
    await startupCheck();
    console.log("🆕 | Starting web server");
    await startWebServer();
    console.log("🆕 | Starting note loop");
    await loop();
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

async function startupCheck() {
  await removeExpiredNotes();
  console.log("🧰 | Removed old expired notes");
}

start().catch(console.error);