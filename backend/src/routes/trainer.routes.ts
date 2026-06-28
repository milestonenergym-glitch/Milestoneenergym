import { Router } from 'express'
const router = Router()
const ph = (n: string) => (_req: any, res: any) => res.json({ success: true, message: `${n} — available in Phase 2/3` })
router.get('/', ph('GET'))
router.post('/', ph('POST'))
router.get('/:id', ph('GET ONE'))
router.put('/:id', ph('PUT'))
router.patch('/:id', ph('PATCH'))
router.delete('/:id', ph('DELETE'))
export default router
