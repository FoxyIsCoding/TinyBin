/*
Hi 👋 this is the file that exports an instance of the server and where we do all registration and whatnot
*/
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Routes } from "./Routes"
import { config } from '../config';

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Register all routes
Routes.forEach(route => {
    app.use(route.prefix, route.router);
});

// TODO: Frontend Migration
// All frontend-related routes are currently in routes/pages.ts
// These will be moved to the frontend application once it's set up
// The backend should only handle API endpoints and database operations

export { app };

export async function startWebServer() {
    const port = config.port;
    app.listen(port, () => {
        console.log(`🌐 | Server running at http://localhost:${port}/`);
    });
}