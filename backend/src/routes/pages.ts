import { Router, Request, Response } from 'express';
import path from 'path';
import { getNoteByUrl } from '../queries/notes.js';
import { makeResponse } from '../modules/Response.js';

const router = Router();
const __dirname = process.cwd();


// View note page
router.get('/paste/:url', async (req: Request, res: Response): Promise<void> => {
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

// Share note page
router.get('/share/:url', async (req: Request, res: Response): Promise<void> => {
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

// umm veri gud editor page
router.get('/new', (req: Request, res: Response): void => {
    res.send(makeResponse(true, null, 'New note page'));
});

export default {
    prefix: '/pages',
    router
}; 