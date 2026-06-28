import { Request, Response, NextFunction } from 'express'

/**
 * Simple request logger middleware.
 * In production, swap for Winston or similar.
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now()
  const { method, url, ip } = req

  res.on('finish', () => {
    const duration = Date.now() - start
    const status = res.statusCode
    const color = status >= 500 ? '\x1b[31m' : status >= 400 ? '\x1b[33m' : '\x1b[32m'
    console.log(`${color}[${new Date().toISOString()}] ${method} ${url} ${status} ${duration}ms\x1b[0m`)
  })

  next()
}
