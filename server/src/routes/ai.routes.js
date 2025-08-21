import { Router } from 'express';
import { generateStudyPlan } from '../controllers/ai.controller.js';

const router = Router();

router.post('/study-plan', generateStudyPlan);

export default router;

