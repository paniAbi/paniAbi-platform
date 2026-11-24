// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { hashSessionToken } from "@/lib/auth/session-token";

const mocks = vi.hoisted(() => ({
  cookie: undefined as string | undefined,
  set: vi.fn(),
  remove: vi.fn(),
  sessionCreate: vi.fn(),
  sessionFindUnique: vi.fn(),
  sessionDeleteMany: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      name === "paniabi_session" && mocks.cookie
        ? { value: mocks.cookie }
        : undefined,
    set: mocks.set,
    delete: mocks.remove,
  }),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    session: {
      create: mocks.sessionCreate,
      findUnique: mocks.sessionFindUnique,
      deleteMany: mocks.sessionDeleteMany,
    },
  },
}));

import {
  SESSION_COOKIE,
  createSession,
  endSession,
  getCurrentUser,
} from "@/lib/auth/session";

const user = { id: "user-1", username: "abril-prueba" };

beforeEach(() => {
  vi.clearAllMocks();
  mocks.cookie = undefined;
});

describe("createSession", () => {
  it("keeps only the token hash and sets a 30-day httpOnly cookie", async () => {
    await createSession("user-1");

    const [name, token, options] = mocks.set.mock.calls[0];
    expect(name).toBe(SESSION_COOKIE);
    expect(options).toMatchObject({
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    const days =
      (options.expires.getTime() - Date.now()) / (24 * 60 * 60 * 1000);
    expect(Math.round(days)).toBe(30);

    const { data } = mocks.sessionCreate.mock.calls[0][0];
    expect(data.userId).toBe("user-1");
    expect(data.tokenHash).toBe(hashSessionToken(token));
    expect(JSON.stringify(data)).not.toContain(token);
  });
});

describe("getCurrentUser", () => {
  it("is nobody without a cookie", async () => {
    await expect(getCurrentUser()).resolves.toBeNull();
    expect(mocks.sessionFindUnique).not.toHaveBeenCalled();
  });

  it("is nobody with an unknown token", async () => {
    mocks.cookie = "made-up";
    mocks.sessionFindUnique.mockResolvedValue(null);

    await expect(getCurrentUser()).resolves.toBeNull();
  });

  it("is Abril with a valid session", async () => {
    mocks.cookie = "token-1";
    mocks.sessionFindUnique.mockResolvedValue({
      expiresAt: new Date(Date.now() + 60_000),
      user,
    });

    await expect(getCurrentUser()).resolves.toEqual(user);
    expect(mocks.sessionFindUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { tokenHash: hashSessionToken("token-1") },
      }),
    );
  });

  it("is nobody once the session expired, and deletes it", async () => {
    mocks.cookie = "token-1";
    mocks.sessionFindUnique.mockResolvedValue({
      expiresAt: new Date(Date.now() - 1),
      user,
    });

    await expect(getCurrentUser()).resolves.toBeNull();
    expect(mocks.sessionDeleteMany).toHaveBeenCalledWith({
      where: { tokenHash: hashSessionToken("token-1") },
    });
  });
});

describe("endSession", () => {
  it("deletes the session and the cookie, so the old cookie no longer works", async () => {
    mocks.cookie = "token-1";

    await endSession();

    expect(mocks.sessionDeleteMany).toHaveBeenCalledWith({
      where: { tokenHash: hashSessionToken("token-1") },
    });
    expect(mocks.remove).toHaveBeenCalledWith(SESSION_COOKIE);
  });
});
