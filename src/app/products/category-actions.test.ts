import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  findUnique: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    category: {
      create: mocks.create,
      findUnique: mocks.findUnique,
    },
  },
}));

vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

import { createCategory } from "@/app/products/category-actions";

describe("createCategory", () => {
  it("does not create a spelling variation of an existing category", async () => {
    mocks.findUnique.mockResolvedValue({ id: "category-1" });

    await expect(createCategory({ name: "Pan-Dulce" })).resolves.toEqual({
      success: false,
      message: "Ya existe una categoría con ese nombre.",
    });

    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("saves a valid category in the agreed form", async () => {
    mocks.findUnique.mockResolvedValue(null);
    mocks.create.mockResolvedValue({ id: "category-1" });

    await expect(createCategory({ name: "  Postres  " })).resolves.toEqual({
      success: true,
    });

    expect(mocks.create).toHaveBeenCalledWith({
      data: { name: "Postres", normalizedName: "postres" },
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/products");
  });
});
