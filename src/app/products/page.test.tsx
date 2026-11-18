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
    mocks.findProducts.mockResolvedValue([]);
  });

  it("shows the category workspace without the New listing label", async () => {
    render(await ProductsPage());

    expect(screen.queryByText(/new listing/i)).not.toBeInTheDocument();
    expect(screen.getByText("Categorías")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sin categoría" })).toBeInTheDocument();
  });
});
