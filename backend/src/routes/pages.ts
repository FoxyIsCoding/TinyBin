import { Router, Request, Response } from 'express';
import path from 'path';
import { getNoteByUrl } from '../queries/notes.js';
import { makeResponse } from '../modules/Response.js';

const router = Router();
const __dirname = process.cwd();

//TODO: No serving HTML files on backend. Thats bad... Your frontend will be in svelte and you integrate into the backend with it.

// View note page
router.get('/paste/:url', async (req: Request, res: Response) => {
    try {
        const note = await getNoteByUrl(req.params.url);
        if (!note) {
            return res.status(404).send(makeResponse(false, null, 'Note not found'));
        }
        res.send(makeResponse(true, note, 'Note retrieved successfully'));
    } catch (error) {
        res.status(500).send(makeResponse(false, null, 'Error retrieving note', error.message));
    }
});

// Share note page
router.get('/share/:url', async (req: Request, res: Response) => {
    try {
        const note = await getNoteByUrl(req.params.url);
        if (!note) {
            return res.status(404).send(makeResponse(false, null, 'Note not found'));
        }
        res.send(makeResponse(true, note, 'Note retrieved successfully'));
    } catch (error) {
        res.status(500).send(makeResponse(false, null, 'Error retrieving note', error.message));
    }
});

// Editor page
router.get('/new', (req: Request, res: Response) => {
    res.send(makeResponse(true, null, 'New note page'));
});

export default {
    prefix: '/pages',
    router
}; 