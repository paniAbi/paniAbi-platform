import { describe, expect, it } from "vitest";
import {
  categoryFormSchema,
  normalizeCategoryName,
} from "@/lib/category-schema";

describe("categoryFormSchema", () => {
  it("shows Abril what to correct when a category name cannot be saved", () => {
    const emptyName = categoryFormSchema.safeParse({ name: "" });
    const spacesOnly = categoryFormSchema.safeParse({ name: "   " });
    const tooLong = categoryFormSchema.safeParse({ name: "a".repeat(51) });

    expect(emptyName.error?.issues[0]?.message).toBe(
      "Ingresá un nombre de categoría.",
    );
    expect(spacesOnly.error?.issues[0]?.message).toBe(
      "Ingresá un nombre de categoría.",
    );
    expect(tooLong.error?.issues[0]?.message).toBe(
      "El nombre no puede tener más de 50 caracteres. Achicalo.",
    );
  });

  it("treats the agreed spelling variations as the same category", () => {
    const panDulce = normalizeCategoryName("Pan dulce");

    expect(normalizeCategoryName("pAn dulce")).toBe(panDulce);
    expect(normalizeCategoryName("Pan Dulce")).toBe(panDulce);
    expect(normalizeCategoryName("Pan-Dulce")).toBe(panDulce);
    expect(normalizeCategoryName("Panes dulces")).not.toBe(panDulce);
  });
});
