import { Pool } from 'pg';
import { config } from './config';

const pool = new Pool({
    connectionString: config.database_url
});

export async function setupDatabase() {
    try {
        // Test the connection
        const client = await pool.connect();
        console.log('Database connection successful');
        client.release();
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}

export { pool }; 