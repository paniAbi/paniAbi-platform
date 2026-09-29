"use server";

import { revalidatePath } from "next/cache";
import {
  productFormSchema,
  type ProductFormValues,
} from "@/lib/product-schema";
import { prisma } from "@/lib/prisma";

export type CreateProductResult =
  { success: true } | { success: false; message: string };

export async function createProduct(
  values: ProductFormValues,
): Promise<CreateProductResult> {
  const parsedValues = productFormSchema.safeParse(values);

  if (!parsedValues.success) {
    return {
      success: false,
      message: "Check the product details and try again.",
    };
  }

  await prisma.product.create({
    data: {
      name: parsedValues.data.name,
      // Convert the form's pesos to integer cents at the database boundary.
      priceCents: Math.round(parsedValues.data.pricePesos * 100),
    },
  });

  revalidatePath("/products");
  return { success: true };
}
