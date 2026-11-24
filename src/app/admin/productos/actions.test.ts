// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
  create: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({
  getCurrentUser: mocks.getCurrentUser,
}));
vi.mock("@/lib/prisma", () => ({
  prisma: { product: { create: mocks.create } },
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

import { createProduct } from "@/app/admin/productos/actions";

const product = {
  name: "TEST - Budín de prueba",
  pricePesos: 850,
  categoryId: "c123456789012345678901234",
};

describe("createProduct", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getCurrentUser.mockResolvedValue({ id: "u1", username: "abril" });
  });

  // Calls the server action directly, as anyone could with a hand-made
  // request, without going through any screen.
  it("saves nothing when nobody is logged in", async () => {
    mocks.getCurrentUser.mockResolvedValue(null);

    await expect(createProduct(product)).resolves.toEqual({
      success: false,
      message: "Tenés que entrar para guardar cambios.",
    });
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("stores the product in the category where Abril opened the form", async () => {
    await expect(createProduct(product)).resolves.toEqual({ success: true });

    expect(mocks.create).toHaveBeenCalledWith({
      data: {
        name: "TEST - Budín de prueba",
        priceCents: 85000,
        categoryId: "c123456789012345678901234",
      },
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/admin/productos");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/");
  });

  it("answers in Spanish when the data arrives wrong", async () => {
    await expect(createProduct({ name: "", pricePesos: 800 })).resolves.toEqual(
      {
        success: false,
        message: "Revisá los datos del producto y probá de nuevo.",
      },
    );
    expect(mocks.create).not.toHaveBeenCalled();
  });
});
