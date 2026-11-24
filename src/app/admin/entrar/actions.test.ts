// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { hashPassword } from "@/lib/auth/password";

const mocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
  createSession: vi.fn(),
  endSession: vi.fn(),
  redirect: vi.fn((path: string) => {
    throw new Error(`redirect:${path}`);
  }),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: { user: { findUnique: mocks.findUnique } },
}));
vi.mock("@/lib/auth/session", () => ({
  LOGIN_PATH: "/admin/entrar",
  createSession: mocks.createSession,
  endSession: mocks.endSession,
}));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));

import { login, logout } from "@/app/admin/entrar/actions";

const WRONG = {
  success: false,
  message: "El usuario o la contraseña no son correctos.",
};

beforeEach(async () => {
  vi.clearAllMocks();
  mocks.findUnique.mockResolvedValue({
    id: "user-1",
    passwordHash: await hashPassword("medialunas de manteca"),
  });
});

describe("login", () => {
  it("opens a session and goes to the products admin with the right password", async () => {
    await expect(
      login({ username: " abril-prueba ", password: "medialunas de manteca" }),
    ).rejects.toThrow("redirect:/admin/productos");

    expect(mocks.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { username: "abril-prueba" } }),
    );
    expect(mocks.createSession).toHaveBeenCalledWith("user-1");
  });

  it("does not say which one is wrong when the password is wrong", async () => {
    await expect(
      login({ username: "abril-prueba", password: "otra cosa" }),
    ).resolves.toEqual(WRONG);
    expect(mocks.createSession).not.toHaveBeenCalled();
  });

  it("gives the same answer when the user does not exist", async () => {
    mocks.findUnique.mockResolvedValue(null);

    await expect(
      login({ username: "nadie", password: "medialunas de manteca" }),
    ).resolves.toEqual(WRONG);
    expect(mocks.createSession).not.toHaveBeenCalled();
  });

  it("asks for the missing field", async () => {
    await expect(login({ username: "", password: "x" })).resolves.toEqual({
      success: false,
      message: "Escribí tu usuario.",
    });
    await expect(
      login({ username: "abril-prueba", password: "" }),
    ).resolves.toEqual({ success: false, message: "Escribí tu contraseña." });
    expect(mocks.findUnique).not.toHaveBeenCalled();
  });
});

describe("logout", () => {
  it("ends the session and goes back to the login screen", async () => {
    await expect(logout()).rejects.toThrow("redirect:/admin/entrar");
    expect(mocks.endSession).toHaveBeenCalled();
  });
});
