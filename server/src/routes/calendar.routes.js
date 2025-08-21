import { Router } from 'express';
import { createEvent, listEvents } from '../controllers/calendar.controller.js';

const router = Router();

router.get('/events', listEvents);
router.post('/events', createEvent);

export default router;

