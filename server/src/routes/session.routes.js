import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { acceptSession, createSessionRequest, declineSession, getSessionById, listMySessions, completeSession, generateCertificate } from '../controllers/session.controller.js';

const router = Router();

router.get('/', requireAuth, listMySessions);
router.post('/', requireAuth, createSessionRequest);
router.get('/:id', requireAuth, getSessionById);
router.post('/:id/accept', requireAuth, acceptSession);
router.post('/:id/decline', requireAuth, declineSession);
router.post('/:id/complete', requireAuth, completeSession);
router.post('/:id/certificate', requireAuth, generateCertificate);

export default router;