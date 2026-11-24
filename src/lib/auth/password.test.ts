// @vitest-environment node
import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

describe("hashPassword", () => {
  it("never stores the password as it was written", async () => {
    const stored = await hashPassword("una contraseña larga");

    expect(stored).not.toContain("una contraseña larga");
    expect(stored).toMatch(/^scrypt\$/);
  });

  it("gives a different result each time for the same password", async () => {
    expect(await hashPassword("una contraseña larga")).not.toBe(
      await hashPassword("una contraseña larga"),
    );
  });
});

describe("verifyPassword", () => {
  it("accepts the right password", async () => {
    const stored = await hashPassword("una contraseña larga");

    expect(await verifyPassword("una contraseña larga", stored)).toBe(true);
  });

  it.each(["una contraseña larg", "Una contraseña larga", ""])(
    "rejects %j",
    async (attempt) => {
      const stored = await hashPassword("una contraseña larga");

      expect(await verifyPassword(attempt, stored)).toBe(false);
    },
  );

  it("rejects a stored value it does not recognise", async () => {
    expect(await verifyPassword("x", "plain-text")).toBe(false);
  });
});
