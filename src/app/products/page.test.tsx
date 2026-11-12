import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProductsPage from "@/app/products/page";

const { findMany } = vi.hoisted(() => ({ findMany: vi.fn() }));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    product: { findMany },
  },
}));

const product = (id: string, name: string) => ({ id, name, priceCents: 80000 });

describe("ProductsPage", () => {
  beforeEach(() => {
    findMany.mockResolvedValue([product("p1", "Lemon loaf")]);
  });

  it("shows every text in Spanish", async () => {
    render(await ProductsPage());

    for (const text of [
      "Gestión de la panadería",
      "Inventario",
      "La vitrina del día",
      "Agregar un producto",
    ]) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
    expect(
      screen.getByRole("heading", { level: 1, name: "Productos" }),
    ).toBeInTheDocument();
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
      " item",
    ]) {
      expect(text).not.toContain(old);
    }
  });

  it("keeps the names Abril wrote and the price format", async () => {
    render(await ProductsPage());

    expect(screen.getByText("Lemon loaf")).toBeInTheDocument();
    expect(screen.getByText("$ 800")).toBeInTheDocument();
  });

  it.each([
    [1, "1 producto"],
    [7, "7 productos"],
  ])("counts %d product(s) as %s", async (count, label) => {
    findMany.mockResolvedValue(
      Array.from({ length: count }, (_, i) => product(`p${i}`, `Torta ${i}`)),
    );
    render(await ProductsPage());

    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
