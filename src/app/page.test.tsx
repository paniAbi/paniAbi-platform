import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { findMany } = vi.hoisted(() => ({ findMany: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ prisma: { product: { findMany } } }));

import HomePage from "@/app/page";

describe("HomePage (public view)", () => {
  beforeEach(() => findMany.mockReset());

  it("shows the bakery name and each product with its price", async () => {
    findMany.mockResolvedValue([
      { id: "p1", name: "Budín de limón", priceCents: 85000 },
      { id: "p2", name: "Chocotorta", priceCents: 3500000 },
    ]);
    render(await HomePage());

    expect(
      screen.getByRole("heading", { level: 1, name: "paniAbi" }),
    ).toBeInTheDocument();
    const items = within(
      screen.getByRole("list", { name: "Productos" }),
    ).getAllByRole("listitem");
    expect(items.map((item) => item.textContent?.replace(/\s+/g, " "))).toEqual(
      ["Budín de limón$ 850", "Chocotorta$ 35.000"],
    );
  });

  it("lets customers look but not change anything", async () => {
    findMany.mockResolvedValue([
      { id: "p1", name: "Budín de limón", priceCents: 85000 },
    ]);
    render(await HomePage());

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(document.querySelector("form")).toBeNull();
  });

  it("says so when there are no products yet", async () => {
    findMany.mockResolvedValue([]);
    render(await HomePage());

    expect(
      screen.getByText("Todavía no hay productos para mostrar."),
    ).toBeInTheDocument();
  });

  it("asks only for what customers may see", async () => {
    findMany.mockResolvedValue([]);
    await HomePage();

    expect(findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, priceCents: true },
    });
  });
});

describe("HomePage metadata", () => {
  it("names the tab after the bakery", async () => {
    const { metadata } = await import("@/app/page");
    expect(metadata.title).toBe("paniAbi");
  });
});
