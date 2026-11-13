import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CategoryList } from "@/components/products/category-list";

describe("CategoryList", () => {
  it("lets Abril choose a category or Sin categoría", () => {
    const onSelect = vi.fn();

    render(
      <CategoryList
        categories={[{ id: "budines", name: "Budines" }]}
        selectedCategoryId={null}
        onSelect={onSelect}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Budines" }));
    expect(onSelect).toHaveBeenLastCalledWith("budines");

    fireEvent.click(screen.getByRole("button", { name: "Sin categoría" }));
    expect(onSelect).toHaveBeenLastCalledWith(null);
  });
});
