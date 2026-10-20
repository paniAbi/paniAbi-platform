import { describe, expect, it } from "vitest";
import { formatPesos } from "@/lib/format-money";

describe("formatPesos", () => {
  it.each([
    [80000, "$\u00a0800"],
    [150000, "$\u00a01.500"],
    [125050, "$\u00a01.250,50"],
    [80005, "$\u00a0800,05"],
  ])("formats %i cents as %s", (priceCents, expected) => {
    expect(formatPesos(priceCents)).toBe(expected);
  });
});
