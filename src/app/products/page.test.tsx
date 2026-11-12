import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProductsPage from "@/app/products/page";

const { findMany } = vi.hoisted(() => ({ findMany: vi.fn() }));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    product: { findMany },
  },
}));

describe("ProductsPage", () => {
  beforeEach(() => {
    findMany.mockResolvedValue([]);
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
});
