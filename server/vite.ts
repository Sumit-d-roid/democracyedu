import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import net from 'net';
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

async function findOpenPort(start: number, attempts = 10): Promise<number> {
  for (let i = 0; i < attempts; i++) {
    const port = start + i;
    const free = await new Promise<boolean>(resolve => {
      const srv = net.createServer()
        .once('error', () => resolve(false))
        .once('listening', () => srv.close(() => resolve(true)))
        .listen(port, '127.0.0.1');
    });
    if (free) return port;
  }
  throw new Error(`No open port found near ${start}`);
}

export async function setupVite(app: Express, server: Server) {
  const hmrHost = process.env.HMR_HOST || process.env.VITE_HMR_HOST || undefined;
  const hmrPort = process.env.HMR_PORT ? Number(process.env.HMR_PORT) : undefined;
  const hmrProtocol = process.env.HMR_PROTOCOL || undefined; // 'ws' | 'wss'

  log(`Vite HMR config -> host: ${hmrHost ?? 'auto'} | port: ${hmrPort ?? 'auto'} | protocol: ${hmrProtocol ?? 'ws (default)'}`);

  let resolvedHmrPort = hmrPort;
  if (!resolvedHmrPort) {
    try {
      resolvedHmrPort = await findOpenPort(24678); // typical Vite baseline
    } catch {
      resolvedHmrPort = undefined;
    }
  }

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: {
      middlewareMode: true,
      allowedHosts: true as const,
      hmr: (hmrHost || resolvedHmrPort || hmrProtocol) ? {
        server,
        protocol: (hmrProtocol as 'ws' | 'wss') || 'ws',
        host: hmrHost,
        clientPort: resolvedHmrPort,
      } : undefined,
    },
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      const template = await fs.promises.readFile(clientTemplate, "utf-8");
      // IMPORTANT: Do not add random query params to the React entry file.
      // Doing so can lead to multiple React runtimes being instantiated
      // (e.g., when HMR refreshes), which causes "Invalid hook call" errors.
      // Vite HMR already handles cache-busting for modules.
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
