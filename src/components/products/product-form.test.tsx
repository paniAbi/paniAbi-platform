import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProductForm } from "@/components/products/product-form";

const { createProduct } = vi.hoisted(() => ({ createProduct: vi.fn() }));

vi.mock("@/app/admin/productos/actions", () => ({ createProduct }));

function fillAndSubmit(name: string, price: string) {
  fireEvent.change(screen.getByLabelText("Nombre del producto"), {
    target: { value: name },
  });
  fireEvent.change(screen.getByLabelText("Precio en pesos"), {
    target: { value: price },
  });
  fireEvent.click(screen.getByRole("button", { name: "Guardar producto" }));
}

describe("ProductForm", () => {
  beforeEach(() => {
    createProduct.mockReset();
  });

  it("shows its labels and example in Spanish", () => {
    render(<ProductForm categoryId={null} categoryName="Sin categoría" />);

    expect(screen.getByLabelText("Nombre del producto")).toHaveAttribute(
      "placeholder",
      "Por ejemplo, Budín de limón",
    );
    expect(screen.getByLabelText("Precio en pesos")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Guardar producto" }),
    ).toBeInTheDocument();
  });

  it("asks for the name and the price when both are empty", async () => {
    render(<ProductForm categoryId={null} categoryName="Sin categoría" />);

    fillAndSubmit("", "");

    expect(
      await screen.findByText("Escribí el nombre del producto."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Escribí el precio del producto."),
    ).toBeInTheDocument();
    expect(createProduct).not.toHaveBeenCalled();
  });

  it("rejects a price of 0 with its own message", async () => {
    render(<ProductForm categoryId={null} categoryName="Sin categoría" />);

    fillAndSubmit("TEST - Medialuna de prueba", "0");

    expect(
      await screen.findByText(
        "El precio tiene que ser de al menos un centavo.",
      ),
    ).toBeInTheDocument();
    expect(createProduct).not.toHaveBeenCalled();
  });

  it("leaves the warnings to the platform, not the browser", () => {
    const { container } = render(
      <ProductForm categoryId={null} categoryName="Sin categoría" />,
    );

    expect(container.querySelector("form")).toHaveAttribute("novalidate");
  });

  it("confirms in Spanish when the product is saved", async () => {
    createProduct.mockResolvedValue({ success: true });
    render(<ProductForm categoryId={null} categoryName="Sin categoría" />);

    fillAndSubmit("TEST - Medialuna de prueba", "800");

    expect(
      await screen.findByText("Producto agregado a Sin categoría."),
    ).toBeInTheDocument();
    expect(createProduct).toHaveBeenCalledWith({
      name: "TEST - Medialuna de prueba",
      pricePesos: 800,
      categoryId: null,
    });
  });

  it("shows the duplicate warning under the name and keeps the entered values", async () => {
    const message = "Ya hay un producto con ese nombre en Budines. Elegí otro nombre o buscá el que ya cargaste.";
    createProduct.mockResolvedValue({ success: false, message, field: "name" });
    render(<ProductForm categoryId={null} categoryName="Sin categoría" />);
    fillAndSubmit("budin de limon", "850");
    expect(await screen.findByText(message)).toHaveAttribute("id", "product-name-error");
    expect(screen.getByLabelText("Nombre del producto")).toHaveValue("budin de limon");
    expect(screen.getByLabelText("Precio en pesos")).toHaveValue(850);
  });

  it("rejects a name made only of signs as empty", async () => {
    render(<ProductForm categoryId={null} categoryName="Sin categoría" />);
    fillAndSubmit("---", "850");
    expect(await screen.findByText("Escribí el nombre del producto.")).toBeInTheDocument();
    expect(createProduct).not.toHaveBeenCalled();
  });
});
