import { describe, expect, it } from "vitest";
import { newPasswordProblem } from "@/lib/auth/new-password";

describe("newPasswordProblem", () => {
  it("accepts a long password typed twice the same", () => {
    expect(
      newPasswordProblem(
        "medialunas de manteca 2026",
        "medialunas de manteca 2026",
      ),
    ).toBeNull();
  });

  it("asks for at least 12 characters", () => {
    expect(newPasswordProblem("corta123", "corta123")).toBe(
      "The password must have at least 12 characters.",
    );
  });

  it("asks to type the same password twice", () => {
    expect(
      newPasswordProblem("medialunas de manteca", "medialunas de mantecas"),
    ).toBe("The two passwords are different.");
  });
});
