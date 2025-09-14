import apicache from 'apicache';

export const cache = apicache.middleware;

// Cache successful GET requests for 5 minutes
export const cacheMiddleware = cache('5 minutes', (req, res) => res.statusCode === 200);