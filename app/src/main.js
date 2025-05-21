import dotenv from 'dotenv';
dotenv.config()

import { loadDb } from './backend/load_db.js';

//setup and load all shits
async function start() {
  console.log('Starting application...')
  console.log("Starting db")
  await loadDb()
}

start()