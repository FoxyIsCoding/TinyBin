import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();

import dotenv from 'dotenv';
dotenv.config()

import path from 'path';
import { fileURLToPath } from 'url';
import { url } from 'inspector';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function startWebServer() {
    const port = process.env.WEB_PORT || 3000;

    app.use(cors());
    app.use(bodyParser.json());

    // Serve static files
    app.use(express.static(path.join(__dirname, '..', '..')));
    app.use(express.static(path.join(__dirname, '..', 'frontend')));

    // Serve the landing shit
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '..', '..', 'index.html'));
    });

    // some W code here to get a note by its url (Prob only dev testing reasons)
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

    // We prob all know what this does lol
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
    // This is the api to get a note by its id (This comment is bad. AI said that shit)
    app.post('/api/addnote', async (req, res) => {
        const { title, text, expiresAt } = req.body;
        const { addNote, getNoteById } = await import('./db.js');
        const noteId = await addNote(title, text, expiresAt);
        const note = await getNoteById(noteId);
        console.log('Returned note:', note);
        res.json({ id: noteId, url: note.url });
        
        
    });
    // Idk but i have a feeling this is a editor to craete a note
    // and not a viewer :3
    app.get('/new', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'frontend', 'editor.html'));
    });

    app.listen(port, () => {
        console.log(`🌐 | Server running at http://localhost:${port}/`);
    });
}