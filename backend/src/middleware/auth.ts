import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User, { UserRole, ROLE_PERMISSIONS } from '../models/User'
import { AppError } from './errorHandler'

/* ─── Extended Request type ─── */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        role: UserRole
        branch?: string
        name: string
        email: string
      }
    }
  }
}

/**
 * JWT Authentication Middleware.
 * Verifies the Bearer token and attaches user to req.user.
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('Authentication required. Please log in.', 401)
    }

    const token = authHeader.split(' ')[1]
    const secret = process.env.JWT_SECRET
    if (!secret) throw new AppError('Server configuration error', 500)

    let decoded: any
    try {
      decoded = jwt.verify(token, secret)
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        throw new AppError('Session expired. Please log in again.', 401)
      }
      throw new AppError('Invalid authentication token.', 401)
    }

    const user = await User.findById(decoded.id).select('+refreshToken')
    if (!user) throw new AppError('User not found.', 401)
    if (!user.isActive) throw new AppError('Your account has been deactivated.', 403)
    if (user.isLocked()) throw new AppError('Account is temporarily locked due to multiple failed login attempts.', 403)

    req.user = {
      id: user._id.toString(),
      role: user.role,
      branch: user.branch?.toString(),
      name: user.name,
      email: user.email,
    }

    next()
  } catch (error) {
    next(error)
  }
}

/**
 * Role-Based Access Control Middleware.
 * Pass the required roles as arguments.
 *
 * @example authorize('admin', 'manager')
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Authentication required.', 401))
      return
    }

    if (!roles.includes(req.user.role) && req.user.role !== 'super_admin') {
      next(new AppError(`Access denied. Required roles: ${roles.join(', ')}`, 403))
      return
    }

    next()
  }
}

/**
 * Permission-based access control.
 * Checks if user's role has the given permission.
 */
export const hasPermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Authentication required.', 401))
      return
    }

    const userPermissions = ROLE_PERMISSIONS[req.user.role] || []
    const hasAccess =
      userPermissions.includes('*') ||
      userPermissions.includes(permission) ||
      userPermissions.some(p => permission.startsWith(p.split(':')[0]))

    if (!hasAccess) {
      next(new AppError('Insufficient permissions for this action.', 403))
      return
    }

    next()
  }
}

/**
 * Optional authentication — attaches user if token exists, but doesn't fail if not.
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      const secret = process.env.JWT_SECRET!
      const decoded: any = jwt.verify(token, secret)
      const user = await User.findById(decoded.id)
      if (user?.isActive) {
        req.user = {
          id: user._id.toString(),
          role: user.role,
          branch: user.branch?.toString(),
          name: user.name,
          email: user.email,
        }
      }
    }
    next()
  } catch {
    next() // Ignore auth errors in optional mode
  }
}
