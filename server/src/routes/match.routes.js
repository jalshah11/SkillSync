import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { findMatches } from '../controllers/match.controller.js';

const router = Router();

router.get('/find', requireAuth, findMatches);

export default router;

