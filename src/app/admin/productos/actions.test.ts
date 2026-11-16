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

const product = { name: "TEST - Budín de prueba", pricePesos: 850 };

describe("createProduct", () => {
  beforeEach(() => vi.clearAllMocks());

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

  it("saves the product when Abril is logged in", async () => {
    mocks.getCurrentUser.mockResolvedValue({ id: "u1", username: "abril" });

    await expect(createProduct(product)).resolves.toEqual({ success: true });
    expect(mocks.create).toHaveBeenCalledWith({
      data: { name: "TEST - Budín de prueba", priceCents: 85000 },
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/admin/productos");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/");
  });
});
