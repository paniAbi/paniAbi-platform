import { describe, expect, it } from "vitest";
import { productFormSchema } from "@/lib/product-schema";

describe("productFormSchema", () => {
  it("rejects an empty product name", () => {
    expect(
      productFormSchema.safeParse({ name: "   ", pricePesos: 10 }).success,
    ).toBe(false);
  });

  it("rejects a negative price", () => {
    expect(
      productFormSchema.safeParse({ name: "Lemon loaf", pricePesos: -1 })
        .success,
    ).toBe(false);
  });
});
