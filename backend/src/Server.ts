import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { setupRoutes } from './routes/index';
import { setupDatabase } from './database';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
setupRoutes(app);

// Database setup
setupDatabase();

// Start server
app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
}); 