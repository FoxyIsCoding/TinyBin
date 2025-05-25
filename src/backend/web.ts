import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { create_note, get_note_by_id, get_note_by_url } from '../queries/notes.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function startWebServer() {
    const port = process.env.WEB_PORT || 3000;

    app.use(cors());
    app.use(bodyParser.json());

    // Serve static files
    app.use(express.static(path.join(__dirname, '..', '..')));
    app.use(express.static(path.join(__dirname, '..', 'frontend')));

    // Serve the landing page
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '..', '..', 'index.html'));
    });

    // Get note by URL
    app.get('/api/notes/:url', async (req, res) => {
        const { url } = req.params;
        const note = await get_note_by_url(url);
        if (note) {
            res.json(note);
        } else {
            res.status(404).send('Note not found');
        }
    });

    // View note page
    app.get('/paste/:url', async (req, res) => {
        const { url } = req.params;
        const note = await get_note_by_url(url);
        if (note) {
            res.sendFile(path.join(__dirname, '..', 'frontend', 'view', 'view.html'));
            app.use(express.static(path.join(__dirname, '..', 'frontend', 'view')));
            app.use(express.static(path.join(__dirname, '..', 'frontend')));
        } else {
            res.status(404).send('Note not found');
        }
    });

    // Share note page
    app.get('/share/:url', async (req, res) => {
        const { url } = req.params;
        const note = await get_note_by_url(url);
        if (note) {
            res.sendFile(path.join(__dirname, '..', 'frontend', 'share', 'share.html'));
            app.use(express.static(path.join(__dirname, '..', 'frontend', 'share')));
            app.use(express.static(path.join(__dirname, '..', 'frontend')));
        } else {
            res.status(404).send('Note not found');
        }
    });

    // Editor page
    app.get('/new', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'frontend', 'editor', 'editor.html'));
        app.use(express.static(path.join(__dirname, '..', 'frontend', 'editor')));
    });

    // Create new note
    app.post('/api/addnote', async (req, res) => {
        const { title, text, expiresAt } = req.body;
        const noteId = await create_note(title, text, expiresAt ? new Date(expiresAt) : null);
        const note = await get_note_by_id(noteId);
        console.log('Returned note:', note);
        res.json({ id: noteId, url: note.url });
    });

    app.listen(port, () => {
        console.log(`🌐 | Server running at http://localhost:${port}/`);
    });
}