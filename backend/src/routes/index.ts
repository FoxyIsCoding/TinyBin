import { Express } from 'express';
import healthRoutes from './health';
import notesRoutes from './notes';
import pagesRoutes from './pages';

export function setupRoutes(app: Express) {
    // Health check route
    app.use(healthRoutes.prefix, healthRoutes.router);

    // API routes
    app.use(`/api${notesRoutes.prefix}`, notesRoutes.router);
    app.use(pagesRoutes.prefix, pagesRoutes.router);
} 