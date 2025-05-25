import { Router } from 'express';
import path from 'path';
import { getNoteByUrl } from '../queries/notes.js';

const router = Router();
const __dirname = process.cwd();

//TODO: No serving HTML files on backend. Thats bad... Your frontend will be in svelte and you integrate into the backend with it.

// View note page
router.get('/paste/:url', async (req, res) => {
    const { url } = req.params;
    const note = await getNoteByUrl(url);
    if (note) {
        res.sendFile(path.join(__dirname, 'frontend', 'view', 'view.html'));
    } else {
        res.status(404).send('Note not found');
    }
});

// Share note page
router.get('/share/:url', async (req, res) => {
    const { url } = req.params;
    const note = await getNoteByUrl(url);
    if (note) {
        res.sendFile(path.join(__dirname, 'frontend', 'share', 'share.html'));
    } else {
        res.status(404).send('Note not found');
    }
});

// Editor page
router.get('/new', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'editor', 'editor.html'));
});

export default {
    prefix: '/',
    router
}; 