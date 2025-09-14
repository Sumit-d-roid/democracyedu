import rateLimit, { type Options, type RateLimitRequestHandler } from 'express-rate-limit';
import type { Request, Response } from 'express';

// Augment Express Request type for rateLimit property if not already present
declare module 'express-serve-static-core' {
  interface Request {
    rateLimit?: {
      limit: number;
      current: number;
      remaining: number;
      resetTime?: Date;
    };
  }
}

const baseWindowMs = process.env.NODE_ENV === 'development' ? 1 * 60 * 1000 : 15 * 60 * 1000;
const baseMax = process.env.NODE_ENV === 'development' ? 1000 : 100;

const options: Partial<Options> = {
  windowMs: baseWindowMs,
  max: baseMax,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    const reset = req.rateLimit?.resetTime ? Math.ceil((req.rateLimit.resetTime.getTime() - Date.now()) / 1000) : undefined;
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later',
      retryAfter: reset
    });
  },
  skip: (req: Request) => process.env.NODE_ENV === 'development' && !!req.ip && (
    req.ip === '127.0.0.1' ||
    req.ip === '::1' ||
    req.ip === 'localhost' ||
    req.ip.startsWith('172.')
  )
};

export const rateLimiter: RateLimitRequestHandler = rateLimit(options);