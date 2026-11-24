import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  findCategories: vi.fn(),
  findProducts: vi.fn(),
  requireUser: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    category: { findMany: mocks.findCategories },
    product: { findMany: mocks.findProducts },
  },
}));
vi.mock("@/lib/auth/session", () => ({ requireUser: mocks.requireUser }));
vi.mock("@/app/admin/entrar/actions", () => ({ logout: vi.fn() }));
// Server actions: the page only needs their references. Their own tests
// cover what they do.
vi.mock("@/app/admin/productos/actions", () => ({ createProduct: vi.fn() }));
vi.mock("@/app/admin/productos/category-actions", () => ({
  createCategory: vi.fn(),
}));
vi.mock("@/app/admin/productos/product-category-actions", () => ({
  changeProductCategory: vi.fn(),
}));

import ProductsPage from "@/app/admin/productos/page";

describe("ProductsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireUser.mockResolvedValue({ id: "u1", username: "abril" });
    mocks.findCategories.mockResolvedValue([]);
    mocks.findProducts.mockResolvedValue([
      { id: "p1", name: "Lemon loaf", priceCents: 80000 },
    ]);
  });

  it("sends anyone who is not logged in to the login screen, before reading anything", async () => {
    mocks.requireUser.mockRejectedValue(new Error("redirect:/admin/entrar"));

    await expect(ProductsPage()).rejects.toThrow("redirect:/admin/entrar");
    expect(mocks.findCategories).not.toHaveBeenCalled();
    expect(mocks.findProducts).not.toHaveBeenCalled();
  });

  it("offers a way to log out", async () => {
    render(await ProductsPage());

    expect(screen.getByRole("button", { name: "Salir" })).toBeInTheDocument();
  });

  it("shows the category workspace without the New listing label", async () => {
    render(await ProductsPage());

    expect(screen.queryByText(/new listing/i)).not.toBeInTheDocument();
    expect(screen.getByText("Categorías")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sin categoría" }),
    ).toBeInTheDocument();
  });

  it("shows the header and footer in Spanish", async () => {
    render(await ProductsPage());

    expect(screen.getByText("Gestión de la panadería")).toBeInTheDocument();
    expect(screen.getByText("Inventario")).toBeInTheDocument();
    expect(document.querySelector("footer")?.textContent).toBe(
      "Plataforma paniAbi / Catálogo de productos",
    );
  });

  it("leaves none of the old English texts", async () => {
    render(await ProductsPage());

    const text = document.body.textContent ?? "";
    for (const old of [
      "Bakery workspace",
      "Inventory",
      "The daily shelf",
      "Add a product",
      "Product name",
      "Price in pesos",
      "Add product",
      "paniAbi platform",
      "Product catalogue",
      " items",
    ]) {
      expect(text).not.toContain(old);
    }
  });

  it("keeps the names Abril wrote and the price format", async () => {
    render(await ProductsPage());

    expect(screen.getByText("Lemon loaf")).toBeInTheDocument();
    expect(screen.getByText("$ 800")).toBeInTheDocument();
  });
});
