import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProductsPage from "@/app/products/page";

const { findMany } = vi.hoisted(() => ({ findMany: vi.fn() }));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    product: { findMany },
  },
}));

vi.mock("@/components/products/product-form", () => ({
  ProductForm: () => <div>Product form</div>,
}));

vi.mock("@/components/products/product-list", () => ({
  ProductList: () => <div>Product list</div>,
}));

describe("ProductsPage", () => {
  beforeEach(() => {
    findMany.mockResolvedValue([]);
  });

  it("shows the Hanna Banana name in burgundy without changing the rest of the page", async () => {
    render(await ProductsPage());

    expect(screen.getByText("Hanna Banana")).toHaveClass("text-[#800020]");
    expect(document.querySelector("footer")?.textContent).toContain(
      "paniAbi platform",
    );
    expect(screen.getByText("Product list")).toBeInTheDocument();
    expect(screen.getByText("Product form")).toBeInTheDocument();
  });
});
