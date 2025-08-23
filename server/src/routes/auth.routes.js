import { Router } from 'express';
import { login, logout, me, register, googleLogin } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

export default router;
