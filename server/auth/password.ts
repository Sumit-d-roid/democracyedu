import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generatePasswordResetToken(): string {
  return randomBytes(32).toString('hex');
}

export function generateTwoFactorSecret(): string {
  return randomBytes(20).toString('hex');
}
