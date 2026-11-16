// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  SESSION_DAYS,
  hashSessionToken,
  isSessionExpired,
  newSessionToken,
  sessionExpiresAt,
} from "@/lib/auth/session-token";

describe("session tokens", () => {
  it("creates long, unpredictable tokens", () => {
    const token = newSessionToken();

    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(newSessionToken()).not.toBe(token);
  });

  it("stores only a hash of the token", () => {
    const token = newSessionToken();

    expect(hashSessionToken(token)).toMatch(/^[0-9a-f]{64}$/);
    expect(hashSessionToken(token)).not.toContain(token);
    expect(hashSessionToken(token)).toBe(hashSessionToken(token));
  });
});

describe("session expiry", () => {
  const now = new Date("2026-11-16T12:00:00Z");

  it("lasts 30 days", () => {
    expect(SESSION_DAYS).toBe(30);
    expect(sessionExpiresAt(now).toISOString()).toBe(
      "2026-12-16T12:00:00.000Z",
    );
  });

  it("is still valid after 10 days", () => {
    const tenDaysLater = new Date("2026-11-26T12:00:00Z");

    expect(isSessionExpired(sessionExpiresAt(now), tenDaysLater)).toBe(false);
  });

  it("expires after 30 days", () => {
    const thirtyOneDaysLater = new Date("2026-12-17T12:00:00Z");

    expect(isSessionExpired(sessionExpiresAt(now), thirtyOneDaysLater)).toBe(
      true,
    );
  });
});
