import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

export const db: NodePgDatabase<typeof schema>;
export const sql: any; // SQL template literal for raw queries 