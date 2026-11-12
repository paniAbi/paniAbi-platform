import { describe, expect, it, vi } from "vitest";
import { createProduct } from "@/app/products/actions";

const { create } = vi.hoisted(() => ({ create: vi.fn() }));

vi.mock("@/lib/prisma", () => ({ prisma: { product: { create } } }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

describe("createProduct", () => {
  it("answers in Spanish when the data arrives wrong", async () => {
    await expect(createProduct({ name: "", pricePesos: 800 })).resolves.toEqual(
      {
        success: false,
        message: "Revisá los datos del producto y probá de nuevo.",
      },
    );
    expect(create).not.toHaveBeenCalled();
  });
});
