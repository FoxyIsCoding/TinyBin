import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();

import dotenv from 'dotenv';
dotenv.config()

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function startWebServer() {
    const port = process.env.WEB_PORT || 3000;

    app.use(cors());
    app.use(bodyParser.json());

    // Serve static files
    app.use(express.static(path.join(__dirname, '..', '..')));
    app.use(express.static(path.join(__dirname, '..', 'frontend')));

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '..', '..', 'index.html'));
    });

    // REMOVE or comment out this block if you only want to fetch by URL:
    // app.get('/api/notes/:id', async (req, res) => {
    //     const { id } = req.params;
    //     const { getNoteById } = await import('./db.js');
    //     const note = await getNoteById(id);
    //     if (note) {
    //         res.json(note);
    //     } else {
    //         res.status(404).send('Note not found');
    //     }
    // });

    // This route will now always fetch by URL (string)
    app.get('/api/notes/:url', async (req, res) => {
        const { url } = req.params;
        const { getNoteByURL } = await import('./db.js');
        const note = await getNoteByURL(url);
        if (note) {
            res.json(note);
        } else {
            res.status(404).send('Note not found');
        }
    });

    app.get('/paste/:url', async (req, res) => {
        const { url } = req.params;
        const { getNoteByURL } = await import('./db.js');
        const note = await getNoteByURL(url);
        if (note) {
            res.sendFile(path.join(__dirname, '..', 'frontend', 'view.html'));
            app.use(express.static(path.join(__dirname, '..', 'frontend')));
        } else {
            res.status(404).send('Note not found');
        }
    });

    app.post('/api/addnote', async (req, res) => {
        const { title, text, expiresAt } = req.body;
        const { addNote } = await import('./db.js');
        const noteId = await addNote(title, text, expiresAt);
        res.json({ id: noteId });
    });

    app.get('/new', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'frontend', 'editor.html'));
    });

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
}