import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductList } from "@/components/products/product-list";

describe("ProductList", () => {
  it("renders the products it receives with prices in pesos", () => {
    render(
      <ProductList
        products={[
          { id: "cake-1", name: "Lemon loaf", priceCents: 125050 },
          { id: "cake-2", name: "Chocolate tart", priceCents: 80000 },
          { id: "cake-3", name: "Orange cake", priceCents: 150000 },
          { id: "cake-4", name: "Vanilla muffin", priceCents: 80005 },
        ]}
      />,
    );

    expect(screen.getByText("Lemon loaf")).toBeInTheDocument();
    expect(screen.getByText("Chocolate tart")).toBeInTheDocument();
    expect(screen.getByText("Orange cake")).toBeInTheDocument();
    expect(screen.getByText("Vanilla muffin")).toBeInTheDocument();
    expect(screen.getByText("$ 1.250,50")).toBeInTheDocument();
    expect(screen.getByText("$ 800")).toBeInTheDocument();
    expect(screen.getByText("$ 1.500")).toBeInTheDocument();
    expect(screen.getByText("$ 800,05")).toBeInTheDocument();
    expect(screen.queryByText("Available for sale")).not.toBeInTheDocument();
  });

  it("shows an empty state when there are no products", () => {
    render(<ProductList products={[]} />);

    expect(screen.getByText("Nothing on the shelf yet")).toBeInTheDocument();
    expect(
      screen.queryByRole("list", { name: "Products" }),
    ).not.toBeInTheDocument();
  });
});
