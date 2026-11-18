"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const productCategorySchema = z.object({
  productId: z.string().cuid(),
  categoryId: z.string().cuid().nullable(),
});

export type ChangeProductCategoryResult =
  { success: true } | { success: false; message: string };

export async function changeProductCategory(
  values: z.infer<typeof productCategorySchema>,
): Promise<ChangeProductCategoryResult> {
  const parsedValues = productCategorySchema.safeParse(values);

  if (!parsedValues.success) {
    return { success: false, message: "Revisá la categoría elegida." };
  }

  const product = await prisma.product.findUnique({
    where: { id: parsedValues.data.productId },
  });

  if (!product) {
    return { success: false, message: "No encontramos ese producto." };
  }

  if (parsedValues.data.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: parsedValues.data.categoryId },
    });

    if (!category) {
      return { success: false, message: "No encontramos esa categoría." };
    }
  }

  await prisma.product.update({
    where: { id: product.id },
    data: { categoryId: parsedValues.data.categoryId },
  });

  revalidatePath("/products");
  return { success: true };
}
