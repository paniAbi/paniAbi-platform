import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CategoryList } from "@/components/products/category-list";

describe("CategoryList", () => {
  it("lets Abril choose a category and keeps Sin categoría last", () => {
    const onSelect = vi.fn();

    render(
      <CategoryList
        categories={[
          { id: "arbol", name: "Árbol" },
          { id: "budines", name: "budines" },
          { id: "tortas", name: "Tortas" },
        ]}
        selectedCategoryId={null}
        onSelect={onSelect}
      />,
    );

    expect(
      screen.getAllByRole("button").map((button) => button.textContent),
    ).toEqual(["Árbol", "budines", "Tortas", "Sin categoría"]);

    fireEvent.click(screen.getByRole("button", { name: "budines" }));
    expect(onSelect).toHaveBeenLastCalledWith("budines");

    fireEvent.click(screen.getByRole("button", { name: "Sin categoría" }));
    expect(onSelect).toHaveBeenLastCalledWith(null);
  });
});
