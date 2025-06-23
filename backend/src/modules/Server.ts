
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Routes } from "./Routes.js"
import { config } from '../config.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Register all routes so it will work somehow
Routes.forEach(route => {
    app.use(route.prefix, route.router);
});

// DONE: Frontend Migration


export { app };

export async function startWebServer() {
    const port = config.port;
    app.listen(port, () => {
        console.log(`🌐 | Server running at http://localhost:${port}/`);
    });
}