import { Router, Request, Response } from 'express';
import { makeResponse } from '../modules/Response.js';

const router = Router();

// just a health check
// PS: i forgot this existed lol

router.get('/', (req: Request, res: Response) => {
    res.send(makeResponse(true, { status: 'ok' }, 'Health check passed'));
});

export default {
    router,
    prefix: '/health'
};