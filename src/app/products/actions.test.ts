import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: { product: { create: mocks.create } },
}));

vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

import { createProduct } from "@/app/products/actions";

describe("createProduct", () => {
  beforeEach(() => vi.clearAllMocks());

  it("stores a product in the category where Abril opened the form", async () => {
    mocks.create.mockResolvedValue({ id: "product-1" });

    await expect(
      createProduct({
        name: "Budín de limón",
        pricePesos: 850,
        categoryId: "c123456789012345678901234",
      }),
    ).resolves.toEqual({ success: true });

    expect(mocks.create).toHaveBeenCalledWith({
      data: {
        name: "Budín de limón",
        priceCents: 85000,
        categoryId: "c123456789012345678901234",
      },
    });
  });

  it("answers in Spanish when the data arrives wrong", async () => {
    await expect(createProduct({ name: "", pricePesos: 800 })).resolves.toEqual(
      {
        success: false,
        message: "Revisá los datos del producto y probá de nuevo.",
      },
    );
    expect(mocks.create).not.toHaveBeenCalled();
  });
});
