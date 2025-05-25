import { removeExpiredNotes } from './queries/notes.js';
import { loop } from './db/utils';
import { startWebServer } from './modules/Server';


// Setup and load all components
async function start() {
  try {
    console.log('⌚ | Starting application...');
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