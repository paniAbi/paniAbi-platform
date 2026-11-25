"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";
import {
  productFormSchema,
  type ProductFormValues,
} from "@/lib/product-schema";
import { prisma } from "@/lib/prisma";
import { normalizeCategoryName } from "@/lib/category-schema";
import { Prisma } from "@prisma/client";

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
      message: "Revisá los datos del producto y probá de nuevo.",
    };
  }

  const normalizedName = normalizeCategoryName(parsedValues.data.name);
  const products = await prisma.product.findMany({ select: { name: true } });
  if (
    !normalizedName ||
    products.some((product) => normalizeCategoryName(product.name) === normalizedName)
  ) {
    return { success: false, message: "Revisá el nombre del producto." };
  }

  try {
    await prisma.product.create({
      data: {
        name: parsedValues.data.name,
        normalizedName,
        // Convert the form's pesos to integer cents at the database boundary.
        priceCents: Math.round(parsedValues.data.pricePesos * 100),
        categoryId: parsedValues.data.categoryId ?? null,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { success: false, message: "Revisá el nombre del producto." };
    }
    return { success: false, message: "No se pudo guardar el producto. Probá de nuevo." };
  }

  revalidatePath("/admin/productos");
  // The public view on the home page lists the same products.
  revalidatePath("/");
  return { success: true };
}
