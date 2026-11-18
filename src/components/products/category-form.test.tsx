import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CategoryForm } from "@/components/products/category-form";

vi.mock("@/app/products/category-actions", () => ({
  createCategory: vi.fn(),
}));

describe("CategoryForm", () => {
  it("shows Spanish controls for creating a category", () => {
    render(<CategoryForm />);

    expect(screen.getByLabelText("Nombre de la categoría")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Crear categoría" }),
    ).toBeInTheDocument();
  });
});
