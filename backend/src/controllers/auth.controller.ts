import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User, IUser } from '../models/User'
import crypto from 'crypto'

/**
 * Generate tokens
 */
const generateTokens = (user: IUser) => {
  const payload = { id: user._id, role: user.role, branch: user.branch }
  
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m'
  })
  
  const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
  })

  return { accessToken, refreshToken }
}

/**
 * @route   POST /api/auth/login
 * @desc    Login user & get token
 * @access  Public
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body

    if (!identifier || !password) {
      res.status(400).json({ success: false, error: 'Please provide email/phone and password' })
      return
    }

    // Find by email or phone
    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { phone: identifier }]
    }).select('+password +accountLockedUntil +failedLoginAttempts')

    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid credentials' })
      return
    }

    // Check lockout
    if (user.accountLockedUntil && user.accountLockedUntil > new Date()) {
      res.status(403).json({ success: false, error: `Account locked. Try again later.` })
      return
    }

    // Verify password
    const isMatch = await user.comparePassword(password)
    
    if (!isMatch) {
      // Handle failed attempts
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1
      if (user.failedLoginAttempts >= 5) {
        user.accountLockedUntil = new Date(Date.now() + 15 * 60 * 1000) // 15 mins lock
      }
      await user.save()
      
      res.status(401).json({ success: false, error: 'Invalid credentials' })
      return
    }

    // Reset failed attempts on success
    user.failedLoginAttempts = 0
    user.accountLockedUntil = undefined
    user.lastLogin = new Date()
    
    const { accessToken, refreshToken } = generateTokens(user)
    user.refreshToken = refreshToken
    await user.save()

    // Send cookie if desired, or just JSON
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.firstName + ' ' + user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          branch: user.branch
        },
        accessToken
      }
    })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
}

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken

    if (!token) {
      res.status(401).json({ success: false, error: 'Refresh token required' })
      return
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as any
    const user = await User.findById(decoded.id).select('+refreshToken')

    if (!user || user.refreshToken !== token) {
      res.status(401).json({ success: false, error: 'Invalid refresh token' })
      return
    }

    if (user.status !== 'active') {
      res.status(403).json({ success: false, error: 'Account inactive' })
      return
    }

    const tokens = generateTokens(user)
    user.refreshToken = tokens.refreshToken
    await user.save()

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({ success: true, accessToken: tokens.accessToken })
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid or expired refresh token' })
  }
}

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user & clear tokens
 * @access  Private
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user.id, { $unset: { refreshToken: 1 } })
    }
    res.clearCookie('refreshToken')
    res.json({ success: true, data: 'Logged out successfully' })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
}

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id)
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' })
      return
    }
    res.json({ success: true, data: user })
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message })
  }
}
