import { Express } from 'express';
import healthRoutes from './health.js';
import notesRoutes from './notes.js';
import pagesRoutes from './pages.js';

// umm, pretty self explanatory

export function setupRoutes(app: Express) {
    // Health check route
    app.use(healthRoutes.prefix, healthRoutes.router);

    // API routes
    app.use(`/api${notesRoutes.prefix}`, notesRoutes.router);
    app.use(pagesRoutes.prefix, pagesRoutes.router);
} 