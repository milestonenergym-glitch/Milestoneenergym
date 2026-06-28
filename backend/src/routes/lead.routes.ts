import { Router } from 'express'
import { LeadController } from '../controllers/lead.controller'
import { authenticate, authorize } from '../middleware/auth'
import rateLimit from 'express-rate-limit'

const router = Router()

/* ─── Rate limit for public lead creation ─── */
const leadCreateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 submissions per hour per IP
  message: { success: false, message: 'Too many enquiries submitted. Please call us directly.' },
})

/* ─── Public Routes ─── */
// Website free trial / contact form (no auth required)
router.post('/', leadCreateLimiter, LeadController.createLead)

/* ─── Protected Routes (staff only) ─── */
router.use(authenticate)

router.get('/', authorize('super_admin', 'admin', 'manager', 'receptionist'), LeadController.getLeads)
router.get('/stats', authorize('super_admin', 'admin', 'manager'), LeadController.getStats)
router.get('/:id', authorize('super_admin', 'admin', 'manager', 'receptionist'), LeadController.getLead)
router.patch('/:id', authorize('super_admin', 'admin', 'manager', 'receptionist'), LeadController.updateLead)
router.delete('/:id', authorize('super_admin', 'admin', 'manager'), LeadController.deleteLead)
router.post('/bulk-action', authorize('super_admin', 'admin', 'manager'), LeadController.bulkAction)

export default router
