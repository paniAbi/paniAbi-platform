import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
  redirect: vi.fn((path: string) => {
    throw new Error(`redirect:${path}`);
  }),
}));

vi.mock("@/lib/auth/session", () => ({
  getCurrentUser: mocks.getCurrentUser,
}));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/app/admin/entrar/actions", () => ({ login: vi.fn() }));

import LoginPage from "@/app/admin/entrar/page";

describe("LoginPage", () => {
  beforeEach(() => mocks.getCurrentUser.mockReset());

  it("explains what to do if Abril forgets the password", async () => {
    mocks.getCurrentUser.mockResolvedValue(null);
    render(await LoginPage());

    expect(
      screen.getByText(
        "¿Te olvidaste la contraseña? Pedile a Juan que te la cambie.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
  });

  it("goes straight to the products admin when Abril is already logged in", async () => {
    mocks.getCurrentUser.mockResolvedValue({ id: "u1", username: "abril" });

    await expect(LoginPage()).rejects.toThrow("redirect:/admin/productos");
  });
});
