import apicache from 'apicache';
import type { Request, Response } from 'express';

export const cache = apicache.middleware;

// Cache successful GET requests for 5 minutes – add explicit types for req/res to avoid implicit any
export const cacheMiddleware = cache(
  '5 minutes',
  (req: Request, res: Response) => res.statusCode === 200
);
