import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getMyProfile, updateMyProfile, uploadAvatar } from '../controllers/user.controller.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/me', requireAuth, getMyProfile);
router.put('/me', requireAuth, updateMyProfile);
router.post('/me/avatar', requireAuth, upload.single('avatar'), uploadAvatar);

export default router;

