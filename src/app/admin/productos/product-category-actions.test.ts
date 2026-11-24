import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
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

vi.mock("@/lib/auth/session", () => ({
  getCurrentUser: mocks.getCurrentUser,
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

import { changeProductCategory } from "@/app/admin/productos/product-category-actions";

describe("changeProductCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getCurrentUser.mockResolvedValue({ id: "u1", username: "abril" });
  });

  it("changes nothing when nobody is logged in", async () => {
    mocks.getCurrentUser.mockResolvedValue(null);

    await expect(
      changeProductCategory({
        productId: "c123456789012345678901234",
        categoryId: null,
      }),
    ).resolves.toEqual({
      success: false,
      message: "Tenés que entrar para guardar cambios.",
    });
    expect(mocks.productFindUnique).not.toHaveBeenCalled();
    expect(mocks.productUpdate).not.toHaveBeenCalled();
  });

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
