import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProductWorkspace } from "@/components/products/product-workspace";

const mocks = vi.hoisted(() => ({
  createCategory: vi.fn(),
  createProduct: vi.fn(),
  changeProductCategory: vi.fn(),
}));

vi.mock("@/app/admin/productos/category-actions", () => ({
  createCategory: mocks.createCategory,
}));

vi.mock("@/app/admin/productos/actions", () => ({
  createProduct: mocks.createProduct,
}));

vi.mock("@/app/admin/productos/product-category-actions", () => ({
  changeProductCategory: mocks.changeProductCategory,
}));

afterEach(() => vi.clearAllMocks());

describe("ProductWorkspace", () => {
  it("shows Sin categoría and opens its product form when no categories exist", () => {
    render(<ProductWorkspace categories={[]} uncategorizedProducts={[]} />);

    expect(
      screen.getByRole("button", { name: "Sin categoría" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Agregar producto" }));

    expect(
      screen.getByText("Agregar producto a Sin categoría"),
    ).toBeInTheDocument();
  });

  it("shows a selected category's products and saves a new product in it", async () => {
    mocks.createProduct.mockResolvedValue({ success: true });

    render(
      <ProductWorkspace
        categories={[
          {
            id: "c123456789012345678901234",
            name: "Budines",
            products: [
              { id: "budin-1", name: "Budín de limón", priceCents: 85000 },
            ],
          },
        ]}
        uncategorizedProducts={[]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Budines" }));

    expect(
      screen.getByRole("heading", { name: "Budines" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Budín de limón")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Agregar producto" }));
    fireEvent.change(screen.getByLabelText("Nombre del producto"), {
      target: { value: "Budín de naranja" },
    });
    fireEvent.change(screen.getByLabelText("Precio en pesos"), {
      target: { value: "900" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar producto" }));

    await waitFor(() => {
      expect(mocks.createProduct).toHaveBeenCalledWith({
        name: "Budín de naranja",
        pricePesos: 900,
        categoryId: "c123456789012345678901234",
      });
    });
  });

  it("keeps an empty category visible and lets Abril open its product form", () => {
    render(
      <ProductWorkspace
        categories={[{ id: "tortas", name: "Tortas", products: [] }]}
        uncategorizedProducts={[]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Tortas" }));

    expect(screen.getByRole("heading", { name: "Tortas" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Agregar producto" }));

    expect(screen.getByText("Agregar producto a Tortas")).toBeInTheDocument();
  });
});
