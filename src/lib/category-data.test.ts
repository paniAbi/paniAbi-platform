import { afterEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";

const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const productName = `TEST - Category product ${suffix}`;
let createdProductId: string | undefined;
let createdCategoryId: string | undefined;

afterEach(async () => {
  if (createdProductId) {
    await prisma.product.delete({ where: { id: createdProductId } });
    createdProductId = undefined;
  }

  if (createdCategoryId) {
    await prisma.category.delete({ where: { id: createdCategoryId } });
    createdCategoryId = undefined;
  }
});

describe("category data", () => {
  it("stores a category and lets a product have one or none", async () => {
    const uncategorizedProduct = await prisma.product.create({
      data: { name: productName, priceCents: 85000 },
    });
    createdProductId = uncategorizedProduct.id;

    expect(uncategorizedProduct.categoryId).toBeNull();

    const category = await prisma.category.create({
      data: {
        name: `TEST - Budines ${suffix}`,
        normalizedName: `test-budines-${suffix}`,
      },
    });
    createdCategoryId = category.id;

    const categorizedProduct = await prisma.product.update({
      where: { id: uncategorizedProduct.id },
      data: { categoryId: category.id },
    });

    expect(categorizedProduct.categoryId).toBe(category.id);
  });
});
