import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProductCategoryChange } from "@/components/products/product-category-change";

const mocks = vi.hoisted(() => ({ changeProductCategory: vi.fn() }));

vi.mock("@/app/products/product-category-actions", () => ({
  changeProductCategory: mocks.changeProductCategory,
}));

describe("ProductCategoryChange", () => {
  it("offers other categories and confirms before moving a product", async () => {
    mocks.changeProductCategory.mockResolvedValue({ success: true });

    render(
      <ProductCategoryChange
        productId="c123456789012345678901234"
        currentCategoryId="budines"
        categories={[
          { id: "budines", name: "Budines" },
          { id: "tortas", name: "Tortas" },
        ]}
      />,
    );

    expect(screen.queryByRole("option", { name: "Budines" })).toBeNull();
    expect(screen.getByRole("option", { name: "Tortas" })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Sin categoría" }),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Cambiar categoría a…"), {
      target: { value: "tortas" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Confirmar cambio" }));

    await waitFor(() => {
      expect(mocks.changeProductCategory).toHaveBeenCalledWith({
        productId: "c123456789012345678901234",
        categoryId: "tortas",
      });
    });
  });
});
