// A session is a random token in Abril's browser cookie. The database keeps
// only its SHA-256 hash, so a copy of the database cannot be used to log in.
import { createHash, randomBytes } from "node:crypto";

export const SESSION_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

// 32 random bytes -> 43 URL-safe characters.
export function newSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function sessionExpiresAt(now: Date = new Date()): Date {
  return new Date(now.getTime() + SESSION_DAYS * DAY_MS);
}

export function isSessionExpired(expiresAt: Date, now: Date = new Date()) {
  return expiresAt.getTime() <= now.getTime();
}
