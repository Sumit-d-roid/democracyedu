import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config";
import { rateLimiter } from "./middleware/rateLimit";
import { cacheMiddleware } from "./middleware/cache";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./auth/routes";

// API Version
const API_VERSION = "v1";

const app = express();

// Trust first proxy
app.set('trust proxy', 1);

// Security middleware
// Allow disabling CSP quickly in development if it becomes noisy
const disableCSP = process.env.DISABLE_CSP === 'true';

app.use(
  helmet({
    contentSecurityPolicy: disableCSP ? false : process.env.NODE_ENV === 'development' ? {
      useDefaults: true,
      directives: {
        // Base
        'default-src': ["'self'"],
        // Development convenience: allow inline/eval for Vite + React Refresh
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        // Allow websocket + any localhost port + fonts + data/blob + same-origin API
        'connect-src': [
          "'self'",
          'ws:',
          'wss:',
          'http://localhost:*',
          'https://localhost:*',
          'data:',
          'blob:',
          'https://fonts.googleapis.com',
          'https://fonts.gstatic.com'
        ],
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
        'img-src': ["'self'", 'data:', 'blob:'],
        'worker-src': ["'self'", 'blob:'],
      },
    } : undefined,
  })
);

// Log the active CSP header once for debugging (first request only)
let cspLogged = false;
app.use((req, res, next) => {
  if (!cspLogged) {
    const csp = res.getHeader('Content-Security-Policy');
    if (csp) {
      log(`Active CSP header: ${csp}`);
      cspLogged = true;
    }
  }
  next();
});
app.use(cors(config.cors));
app.use(rateLimiter);

// Body parsing middleware
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// Authentication routes (no caching)
app.use(`/api/${API_VERSION}/auth`, authRoutes);

// Cache successful GET requests for other routes
app.use(`/api/${API_VERSION}`, cacheMiddleware);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

import net from 'net';

async function findAvailablePort(start: number, maxAttempts = 10): Promise<number> {
  for (let i = 0; i < maxAttempts; i++) {
    const port = start + i;
    const available = await new Promise<boolean>((resolve) => {
      const tester = net.createServer()
        .once('error', () => resolve(false))
        .once('listening', () => tester.close(() => resolve(true)))
        .listen(port, '0.0.0.0');
    });
    if (available) return port;
  }
  throw new Error(`No available port found starting from ${start}`);
}

(async () => {
  const resolvedPort = await findAvailablePort(config.port);
  if (resolvedPort !== config.port) {
    log(`port ${config.port} in use, switching to ${resolvedPort}`);
  }
  // Override config.port locally (do not mutate config object if frozen externally)
  const effectivePort = resolvedPort;

  const server = await registerRoutes(app);

  // Global error handling middleware
  app.use(errorHandler);

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
    server.listen({
    port: effectivePort,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${effectivePort}`);
  });
})();
