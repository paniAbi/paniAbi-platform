import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

import HomePage, { metadata } from "@/app/page";

const budin = { id: "p1", name: "Budín de limón", priceCents: 85000 };
const chocotorta = { id: "p2", name: "Chocotorta", priceCents: 3500000 };
const scone = { id: "p3", name: "Scone", priceCents: 380000 };

// "Budín de limón$ 850": Intl separates the price with a no-break space.
function productsIn(listName: string) {
  return within(screen.getByRole("list", { name: listName }))
    .getAllByRole("listitem")
    .map((item) => item.textContent?.replace(/\s+/g, " "));
}

describe("HomePage (public view)", () => {
  beforeEach(() => {
    mocks.findCategories.mockReset().mockResolvedValue([]);
    mocks.findProducts.mockReset().mockResolvedValue([]);
  });

  it("shows the bakery name and each product with its price, by category", async () => {
    mocks.findCategories.mockResolvedValue([
      { id: "c1", name: "Tortas", products: [chocotorta] },
      { id: "c2", name: "budines", products: [budin] },
    ]);
    mocks.findProducts.mockResolvedValue([scone]);
    render(await HomePage());

    expect(
      screen.getByRole("heading", { level: 1, name: "paniAbi" }),
    ).toBeInTheDocument();
    // Alphabetical, with the products that have no category last.
    expect(
      screen
        .getAllByRole("heading", { level: 2 })
        .map((heading) => heading.textContent),
    ).toEqual(["budines", "Tortas", "Otros productos"]);
    expect(productsIn("budines")).toEqual(["Budín de limón$ 850"]);
    expect(productsIn("Tortas")).toEqual(["Chocotorta$ 35.000"]);
    expect(productsIn("Otros productos")).toEqual(["Scone$ 3.800"]);
  });

  it("does not show empty groups to customers", async () => {
    mocks.findCategories.mockResolvedValue([
      { id: "c1", name: "Tortas", products: [] },
      { id: "c2", name: "Budines", products: [budin] },
    ]);
    render(await HomePage());

    expect(
      screen
        .getAllByRole("heading", { level: 2 })
        .map((heading) => heading.textContent),
    ).toEqual(["Budines"]);
  });

  it("lets customers look but not change anything", async () => {
    mocks.findProducts.mockResolvedValue([budin]);
    render(await HomePage());

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(document.querySelector("form")).toBeNull();
  });

  it("says so when there are no products yet", async () => {
    mocks.findCategories.mockResolvedValue([
      { id: "c1", name: "Tortas", products: [] },
    ]);
    render(await HomePage());

    expect(
      screen.getByText("Todavía no hay productos para mostrar."),
    ).toBeInTheDocument();
  });

  it("asks only for what customers may see", async () => {
    await HomePage();

    const visible = {
      orderBy: { name: "asc" },
      select: { id: true, name: true, priceCents: true },
    };
    expect(mocks.findProducts).toHaveBeenCalledWith({
      where: { isActive: true, categoryId: null },
      ...visible,
    });
    expect(mocks.findCategories.mock.calls[0][0].select.products).toEqual({
      where: { isActive: true },
      ...visible,
    });
  });

  it("names the tab after the bakery", () => {
    expect(metadata.title).toBe("paniAbi");
  });
});
