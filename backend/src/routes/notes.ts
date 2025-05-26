import { Router } from 'express';
import { createNote, getNoteById, getNoteByUrl } from '../queries/notes.js';

const router = Router();

// Get note by URL
router.get('/:url', async (req, res) => {
    const { url } = req.params;
    const note = await getNoteByUrl(url);
    if (note) {
        res.json(note);
    } else {
        res.status(404).send('Note not found');
    }
});

// Create new note
router.post('/add', async (req, res) => {
    const { title, text, expiresAt } = req.body;
    const noteId = await createNote(title, text, expiresAt ? new Date(expiresAt) : null);
    const note = await getNoteById(noteId);
    res.json({ id: noteId, url: note.url });
});

export default {
    prefix: '/api/notes',
    router
}; 