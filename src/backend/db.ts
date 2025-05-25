import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema.js';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const db = drizzle(pool, { schema });

export async function connectDb() {
  try {
    await pool.connect();
    console.log('✅ | Connected to the database');
  } catch (error) {
    console.error('❌ | Failed to connect to the database:', error);
    throw error;
  }
}