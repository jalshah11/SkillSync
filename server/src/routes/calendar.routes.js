import { Router } from 'express';
import { createEvent, listEvents, downloadIcs } from '../controllers/calendar.controller.js';

const router = Router();

router.get('/events', listEvents);
router.post('/events', createEvent);
router.get('/sessions/:id.ics', downloadIcs);

export default router;

