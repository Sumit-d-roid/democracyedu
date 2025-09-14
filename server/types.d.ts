// Local module declarations for packages without bundled types
declare module 'nodemailer';
declare module 'better-sqlite3';

import { TokenPayload } from './auth/jwt';

// Optional light shim examples (left intentionally broad)
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace NodemailerShim {
  interface Transporter {
    // Basic shape; real nodemailer types omitted intentionally
    sendMail(options: Record<string, unknown>): Promise<unknown>;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}