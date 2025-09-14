import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: process.env.NODE_ENV === 'development' ? 1 * 60 * 1000 : 15 * 60 * 1000, // 1 minute in dev, 15 minutes in prod
  max: process.env.NODE_ENV === 'development' ? 1000 : 100, // Higher limit in dev
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  // Configure to work with proxy
  trustProxy: true,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later',
      retryAfter: Math.ceil(req.rateLimit.resetTime.getTime() - Date.now()) / 1000
    });
  },
  // Skip rate limiting in development mode when accessing from localhost
  skip: (req) => process.env.NODE_ENV === 'development' && (
    (req.ip && (
      req.ip === '127.0.0.1' || 
      req.ip === '::1' || 
      req.ip === 'localhost' ||
      req.ip.startsWith('172.') // Docker network
    )) || false
  )
});