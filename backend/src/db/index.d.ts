import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema.js';

export const db: NodePgDatabase<typeof schema>;
export const sql: any; // SQL template literal for raw queries 