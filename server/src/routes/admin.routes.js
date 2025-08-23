import { Router } from 'express'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { listUsers, listSessions, toggleAdmin } from '../controllers/admin.controller.js'

const router = Router()

router.use(requireAuth, requireAdmin)
router.get('/users', listUsers)
router.get('/sessions', listSessions)
router.post('/users/:id/toggle-admin', toggleAdmin)

export default router