/**
 * Milestone Energym — Express.js Backend
 * Main application entry point
 */

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import 'dotenv/config'

import { connectDB } from './config/database'
import { errorHandler } from './middleware/errorHandler'
import { requestLogger } from './middleware/requestLogger'
import { notFound } from './middleware/notFound'

// Route imports
import authRoutes from './routes/auth.routes'
import leadRoutes from './routes/lead.routes'
import memberRoutes from './routes/member.routes'
import membershipRoutes from './routes/membership.routes'
import paymentRoutes from './routes/payment.routes'
import attendanceRoutes from './routes/attendance.routes'
import classRoutes from './routes/class.routes'
import trainerRoutes from './routes/trainer.routes'
import staffRoutes from './routes/staff.routes'
import blogRoutes from './routes/blog.routes'
import settingRoutes from './routes/setting.routes'
import reportRoutes from './routes/report.routes'
import notificationRoutes from './routes/notification.routes'
import chatbotRoutes from './routes/chatbot.routes'
import mediaRoutes from './routes/media.routes'
import inventoryRoutes from './routes/inventory.routes'
import expenseRoutes from './routes/expense.routes'
import couponRoutes from './routes/coupon.routes'
import referralRoutes from './routes/referral.routes'
import taskRoutes from './routes/task.routes'
import visitorRoutes from './routes/visitor.routes'
import backupRoutes from './routes/backup.routes'
import analyticsRoutes from './routes/analytics.routes'
import dashboardRoutes from './routes/dashboard.routes'
import branchRoutes from './routes/branch.routes'

const app = express()
const PORT = process.env.PORT || 5000

/* ─── Security Middleware ─── */
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}))

/* ─── CORS ─── */
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',')
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Branch-ID'],
}))

/* ─── Global Rate Limiter ─── */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
})
app.use('/api', globalLimiter)

/* ─── Parsers ─── */
app.use(compression())
// Stripe/Razorpay webhook needs raw body
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

/* ─── Request Logger ─── */
app.use(requestLogger)

/* ─── Health Check ─── */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Milestone Energym API',
    version: process.env.npm_package_version || '1.0.0',
  })
})

/* ─── API Routes ─── */
const api = '/api'
app.use(`${api}/auth`, authRoutes)
app.use(`${api}/leads`, leadRoutes)
app.use(`${api}/members`, memberRoutes)
app.use(`${api}/memberships`, membershipRoutes)
app.use(`${api}/payments`, paymentRoutes)
app.use(`${api}/attendance`, attendanceRoutes)
app.use(`${api}/classes`, classRoutes)
app.use(`${api}/trainers`, trainerRoutes)
app.use(`${api}/staff`, staffRoutes)
app.use(`${api}/blog`, blogRoutes)
app.use(`${api}/settings`, settingRoutes)
app.use(`${api}/reports`, reportRoutes)
app.use(`${api}/notifications`, notificationRoutes)
app.use(`${api}/chatbot`, chatbotRoutes)
app.use(`${api}/media`, mediaRoutes)
app.use(`${api}/inventory`, inventoryRoutes)
app.use(`${api}/expenses`, expenseRoutes)
app.use(`${api}/coupons`, couponRoutes)
app.use(`${api}/referrals`, referralRoutes)
app.use(`${api}/tasks`, taskRoutes)
app.use(`${api}/visitors`, visitorRoutes)
app.use(`${api}/backup`, backupRoutes)
app.use(`${api}/analytics`, analyticsRoutes)
app.use(`${api}/dashboard`, dashboardRoutes)
app.use(`${api}/branches`, branchRoutes)

/* ─── 404 & Error Handlers ─── */
app.use(notFound)
app.use(errorHandler)

/* ─── Start Server ─── */
const startServer = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`\n🚀 Milestone Energym API running on port ${PORT}`)
    console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`🔗 Health: http://localhost:${PORT}/health\n`)
  })
}

startServer().catch(console.error)

export default app
