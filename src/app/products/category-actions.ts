"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import {
  categoryFormSchema,
  normalizeCategoryName,
  type CategoryFormValues,
} from "@/lib/category-schema";
import { prisma } from "@/lib/prisma";

export type CreateCategoryResult =
  { success: true } | { success: false; message: string };

export async function createCategory(
  values: CategoryFormValues,
): Promise<CreateCategoryResult> {
  const parsedValues = categoryFormSchema.safeParse(values);

  if (!parsedValues.success) {
    return {
      success: false,
      message: parsedValues.error.issues[0]?.message ?? "Revisá el nombre.",
    };
  }

  const normalizedName = normalizeCategoryName(parsedValues.data.name);
  const existingCategory = await prisma.category.findUnique({
    where: { normalizedName },
  });

  if (existingCategory) {
    return {
      success: false,
      message: "Ya existe una categoría con ese nombre.",
    };
  }

  try {
    await prisma.category.create({
      data: { name: parsedValues.data.name, normalizedName },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "Ya existe una categoría con ese nombre.",
      };
    }

    throw error;
  }

  revalidatePath("/products");
  return { success: true };
}
