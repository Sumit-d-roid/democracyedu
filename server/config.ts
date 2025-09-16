import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5001', 10),
  isProduction: process.env.NODE_ENV === 'production',
  cors: {
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.CORS_ORIGIN || 'https://yourdomain.com'
        : 'http://localhost:5001',
    credentials: true,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Higher limit for development
    skipDevelopment: true,
  },
};

export default config;
