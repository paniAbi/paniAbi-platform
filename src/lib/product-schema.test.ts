import { describe, expect, it } from "vitest";
import { productFormSchema } from "@/lib/product-schema";

function firstError(values: { name: string; pricePesos: number }) {
  const result = productFormSchema.safeParse(values);
  return result.success ? undefined : result.error.issues[0]?.message;
}

describe("productFormSchema", () => {
  it.each(["", "   "])("asks for the product name when it is %j", (name) => {
    expect(firstError({ name, pricePesos: 10 })).toBe(
      "Escribí el nombre del producto.",
    );
  });

  it("asks for the price when it is empty", () => {
    // An empty number field reaches the schema as NaN.
    expect(firstError({ name: "Budín de limón", pricePesos: NaN })).toBe(
      "Escribí el precio del producto.",
    );
  });

  it.each([0, -1])("rejects a price of %d", (pricePesos) => {
    expect(firstError({ name: "Budín de limón", pricePesos })).toBe(
      "El precio tiene que ser de al menos un centavo.",
    );
  });

  it("accepts a name and a price", () => {
    expect(
      productFormSchema.safeParse({ name: "Budín de limón", pricePesos: 800 })
        .success,
    ).toBe(true);
  });
});
