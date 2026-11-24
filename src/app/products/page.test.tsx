import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProductsPage from "@/app/products/page";

const mocks = vi.hoisted(() => ({
  findCategories: vi.fn(),
  findProducts: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    category: { findMany: mocks.findCategories },
    product: { findMany: mocks.findProducts },
  },
}));

describe("ProductsPage", () => {
  beforeEach(() => {
    mocks.findCategories.mockResolvedValue([]);
    mocks.findProducts.mockResolvedValue([
      { id: "p1", name: "Lemon loaf", priceCents: 80000 },
    ]);
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
