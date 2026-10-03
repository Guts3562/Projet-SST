import { createHash, randomBytes } from 'node:crypto';

export const createPasswordResetToken = () => randomBytes(32).toString('hex');

export const hashPasswordResetToken = (token) =>
  createHash('sha256').update(token).digest('hex');

export const isValidEmail = (email) =>
  typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
