import { describe, expect, it, vi } from "vitest";

const { redirect } = vi.hoisted(() => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`redirect:${path}`);
  }),
}));
vi.mock("next/navigation", () => ({ redirect }));

import AdminPage from "@/app/admin/page";
import OldProductsPage from "@/app/products/page";

describe("addresses", () => {
  it("/admin opens the products admin", () => {
    expect(() => AdminPage()).toThrow("redirect:/admin/productos");
  });

  it("the old /products address opens the products admin", () => {
    expect(() => OldProductsPage()).toThrow("redirect:/admin/productos");
  });
});
