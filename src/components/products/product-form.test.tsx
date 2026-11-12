import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProductForm } from "@/components/products/product-form";

const { createProduct } = vi.hoisted(() => ({ createProduct: vi.fn() }));

vi.mock("@/app/products/actions", () => ({ createProduct }));

function fillAndSubmit(name: string, price: string) {
  fireEvent.change(screen.getByLabelText("Nombre del producto"), {
    target: { value: name },
  });
  fireEvent.change(screen.getByLabelText("Precio en pesos"), {
    target: { value: price },
  });
  fireEvent.click(screen.getByRole("button", { name: "Agregar producto" }));
}

describe("ProductForm", () => {
  beforeEach(() => {
    createProduct.mockReset();
  });

  it("shows its labels and example in Spanish", () => {
    render(<ProductForm />);

    expect(screen.getByLabelText("Nombre del producto")).toHaveAttribute(
      "placeholder",
      "Por ejemplo: Budín de limón",
    );
    expect(screen.getByLabelText("Precio en pesos")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Agregar producto" }),
    ).toBeInTheDocument();
  });

  it("asks for the name and the price when both are empty", async () => {
    render(<ProductForm />);

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
    render(<ProductForm />);

    fillAndSubmit("TEST - Medialuna de prueba", "0");

    expect(
      await screen.findByText(
        "El precio tiene que ser de al menos un centavo.",
      ),
    ).toBeInTheDocument();
    expect(createProduct).not.toHaveBeenCalled();
  });

  it("leaves the warnings to the platform, not the browser", () => {
    const { container } = render(<ProductForm />);

    expect(container.querySelector("form")).toHaveAttribute("novalidate");
  });

  it("confirms in Spanish when the product is saved", async () => {
    createProduct.mockResolvedValue({ success: true });
    render(<ProductForm />);

    fillAndSubmit("TEST - Medialuna de prueba", "800");

    expect(
      await screen.findByText("Producto agregado a la lista."),
    ).toBeInTheDocument();
    expect(createProduct).toHaveBeenCalledWith({
      name: "TEST - Medialuna de prueba",
      pricePesos: 800,
    });
  });
});
