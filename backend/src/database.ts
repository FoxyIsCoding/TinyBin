import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { config } from './config.js';

const pool = new Pool({
    connectionString: config.database_url
});

export const db = drizzle(pool);

export async function setupDatabase() {
    try {
        // Test the connection
        const client = await pool.connect();
        console.log('Database connection successful');
        
        // Run migrations
        console.log('Running database migrations...');
        await migrate(db, { migrationsFolder: './drizzle' });
        console.log('Migrations completed successfully');
        
        client.release();
    } catch (error) {
        console.error('Database setup failed:', error);
        process.exit(1);
    }
}

export { pool }; 