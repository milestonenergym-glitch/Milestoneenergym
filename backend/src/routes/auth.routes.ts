import express from 'express'
import { authenticate } from '../middleware/auth'
import { login, refreshToken, logout, getMe } from '../controllers/auth.controller'

const router = express.Router()

// Authentication Routes
router.post('/login', login)
router.post('/refresh', refreshToken)
router.post('/logout', authenticate, logout)
router.get('/me', authenticate, getMe)

// Placeholder routes for Phase 3 (Registration, OTP, Password Reset, Google)
const placeholder = (name: string) => (req: any, res: any) => 
  res.json({ success: true, message: `${name} route — coming in Phase 3` })

router.post('/register', placeholder('Register'))
router.post('/forgot-password', placeholder('Forgot Password'))
router.post('/reset-password', placeholder('Reset Password'))
router.post('/verify-otp', placeholder('Verify OTP'))
router.post('/google', placeholder('Google OAuth'))

export default router
