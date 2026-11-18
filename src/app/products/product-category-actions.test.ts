import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  categoryFindUnique: vi.fn(),
  productFindUnique: vi.fn(),
  productUpdate: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    category: { findUnique: mocks.categoryFindUnique },
    product: {
      findUnique: mocks.productFindUnique,
      update: mocks.productUpdate,
    },
  },
}));

vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

import { changeProductCategory } from "@/app/products/product-category-actions";

describe("changeProductCategory", () => {
  it("moves a product without changing its other details", async () => {
    mocks.productFindUnique.mockResolvedValue({
      id: "c123456789012345678901234",
    });
    mocks.categoryFindUnique.mockResolvedValue({
      id: "c234567890123456789012345",
    });
    mocks.productUpdate.mockResolvedValue({});

    await expect(
      changeProductCategory({
        productId: "c123456789012345678901234",
        categoryId: "c234567890123456789012345",
      }),
    ).resolves.toEqual({ success: true });

    expect(mocks.productUpdate).toHaveBeenCalledWith({
      where: { id: "c123456789012345678901234" },
      data: { categoryId: "c234567890123456789012345" },
    });
  });
});
