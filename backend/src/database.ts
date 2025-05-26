import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { config } from './config.js';

const pool = new Pool({
    connectionString: config.database_url,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

export const db = drizzle(pool);

export async function setupDatabase() {
    let retries = 5;
    while (retries > 0) {
        try {
            // Test the connection
            const client = await pool.connect();
            console.log('Database connection successful');
            
            // Run migrations
            console.log('Running database migrations...');
            await migrate(db, { migrationsFolder: './drizzle' });
            console.log('Migrations completed successfully');
            
            client.release();
            return;
        } catch (error) {
            console.error(`Database connection failed (${retries} retries left):`, error);
            retries--;
            if (retries === 0) {
                console.error('Could not connect to database after multiple attempts');
                process.exit(1);
            }
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

export { pool }; 