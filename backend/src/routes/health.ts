import { Router, Request, Response } from 'express';
import { makeResponse } from '../modules/Response.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send(makeResponse(true, { status: 'ok' }, 'Health check passed'));
});

export default {
    router,
    prefix: '/health'
};