"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
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
  // Checked here, next to the data: server actions can be called directly,
  // without opening the page, so the page's redirect is not enough.
  if (!(await getCurrentUser())) {
    return {
      success: false,
      message: "Tenés que entrar para guardar cambios.",
    };
  }

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

  revalidatePath("/admin/productos");
  // The public view on the home page lists the same products.
  revalidatePath("/");
  return { success: true };
}
