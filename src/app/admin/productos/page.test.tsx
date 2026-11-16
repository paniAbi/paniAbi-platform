import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  findMany: vi.fn(),
  requireUser: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: { product: { findMany: mocks.findMany } },
}));
vi.mock("@/lib/auth/session", () => ({ requireUser: mocks.requireUser }));
vi.mock("@/app/admin/entrar/actions", () => ({ logout: vi.fn() }));

import ProductsPage from "@/app/admin/productos/page";

describe("ProductsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.findMany.mockResolvedValue([]);
    mocks.requireUser.mockResolvedValue({ id: "u1", username: "abril" });
  });

  it("sends anyone who is not logged in to the login screen, before reading products", async () => {
    mocks.requireUser.mockRejectedValue(new Error("redirect:/admin/entrar"));

    await expect(ProductsPage()).rejects.toThrow("redirect:/admin/entrar");
    expect(mocks.findMany).not.toHaveBeenCalled();
  });

  it("shows the product form without the New listing label", async () => {
    render(await ProductsPage());

    expect(screen.queryByText(/new listing/i)).not.toBeInTheDocument();
    expect(screen.getByText("Add a product")).toBeInTheDocument();
    expect(screen.getByLabelText("Product name")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add product" }),
    ).toBeInTheDocument();
  });

  it("offers a way to log out", async () => {
    render(await ProductsPage());

    expect(screen.getByRole("button", { name: "Salir" })).toBeInTheDocument();
  });
});
