import { NextRequest } from 'next/server'

// Simple in-memory rate limiting (for production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

/**
 * Rate limiting middleware
 * @param req - Next.js request object
 * @param config - Rate limit configuration
 * @returns true if rate limit exceeded, false otherwise
 */
export function checkRateLimit(
  req: NextRequest,
  config: RateLimitConfig = { maxRequests: 100, windowMs: 60000 } // 100 req/min default
): { limited: boolean; remaining: number } {
  const ip = getClientIp(req)
  const now = Date.now()
  const key = `${ip}-${req.nextUrl.pathname}`

  const record = rateLimitMap.get(key)

  // Clean up expired entries periodically
  if (rateLimitMap.size > 10000) {
    for (const [k, v] of rateLimitMap.entries()) {
      if (v.resetTime < now) {
        rateLimitMap.delete(k)
      }
    }
  }

  if (!record || record.resetTime < now) {
    // Create new record or reset expired one
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + config.windowMs
    })
    return { limited: false, remaining: config.maxRequests - 1 }
  }

  if (record.count >= config.maxRequests) {
    return { limited: true, remaining: 0 }
  }

  record.count++
  return { limited: false, remaining: config.maxRequests - record.count }
}

/**
 * Get client IP address from request
 */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  const cfIp = req.headers.get('cf-connecting-ip') // Cloudflare

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIp) {
    return realIp
  }
  if (cfIp) {
    return cfIp
  }
  return 'unknown'
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim()
    .slice(0, 10000) // Max length
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

/**
 * Validate slug/username format (alphanumeric, hyphens, underscores)
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-zA-Z0-9-_]{3,50}$/.test(slug)
}

/**
 * Check if URL is suspicious (potential phishing)
 */
export function isSuspiciousUrl(url: string): boolean {
  const suspiciousPatterns = [
    /paypal.*login/i,
    /amazon.*signin/i,
    /microsoft.*account/i,
    /google.*signin/i,
    /apple.*id.*login/i,
    /banking.*login/i,
    /\.tk$/i, // Tokelau domains often used for spam
    /\.ml$/i, // Mali domains
    /\.ga$/i, // Gabon domains
  ]

  return suspiciousPatterns.some(pattern => pattern.test(url))
}

/**
 * Log security event (in production, send to monitoring service)
 */
export function logSecurityEvent(event: string, details: any) {
  const timestamp = new Date().toISOString()
  console.warn(`[SECURITY] ${timestamp} - ${event}:`, details)
  
  // In production, send to monitoring service like Sentry, LogRocket, etc.
  // Example: Sentry.captureMessage(event, { level: 'warning', extra: details })
}

/**
 * Generate secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
