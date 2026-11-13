import { describe, expect, it } from "vitest";
import {
  categoryFormSchema,
  normalizeCategoryName,
} from "@/lib/category-schema";

describe("categoryFormSchema", () => {
  it("rejects an empty name and a name longer than 50 characters", () => {
    expect(categoryFormSchema.safeParse({ name: "   " }).success).toBe(false);
    expect(categoryFormSchema.safeParse({ name: "a".repeat(51) }).success).toBe(
      false,
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
