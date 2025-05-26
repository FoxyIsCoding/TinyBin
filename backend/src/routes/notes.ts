import { Router, Request, Response } from 'express';
import { createNote, getNoteById, getNoteByUrl } from '../queries/notes.js';
import { makeResponse } from '../modules/Response.js';

const router = Router();

// Get note by URL
router.get('/:url', async (req: Request, res: Response): Promise<void> => {
    try {
        const note = await getNoteByUrl(req.params.url);
        if (!note) {
            res.status(404).send(makeResponse(false, null, 'Note not found'));
            return;
        }
        res.send(makeResponse(true, note, 'Note retrieved successfully'));
    } catch (error: any) {
        res.status(500).send(makeResponse(false, null, 'Error retrieving note', error?.message || 'Unknown error'));
    }
});

// Create new note
router.post('/add', async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, text, expiresAt } = req.body;
        const noteId = await createNote(title, text, expiresAt ? new Date(expiresAt) : null);
        const note = await getNoteById(noteId);
        res.status(201).send(makeResponse(true, note, 'Note created successfully'));
    } catch (error: any) {
        res.status(500).send(makeResponse(false, null, 'Error creating note', error?.message || 'Unknown error'));
    }
});

export default {
    prefix: '/notes',
    router
}; 