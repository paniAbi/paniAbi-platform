import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// The theme tokens in globals.css must keep the exact values the products
// screen used before they had names, so the screen looks the same.
const css = readFileSync(path.resolve(process.cwd(), "src/app/globals.css"), {
  encoding: "utf8",
});

function tokenValue(name: string): string | undefined {
  const match = new RegExp(`--${name}:\\s*([^;]+);`).exec(css);
  return match?.[1].trim();
}

describe("theme tokens", () => {
  it.each([
    ["color-ink", "#263a31"],
    ["color-brand", "#31594a"],
    ["color-brand-hover", "#26483a"],
    ["color-highlight", "#b65f48"],
    ["color-line", "#dfe3dc"],
    ["color-line-soft", "#edf0ea"],
    ["color-line-row", "#e7e8e1"],
    ["color-line-divider", "#d8ddd5"],
    ["color-mist", "#edf2ee"],
    ["color-subtle", "#788178"],
    ["color-tagline", "#778078"],
    ["color-label", "#7c847d"],
    ["color-quiet", "#727b74"],
    ["color-faint", "#929991"],
    ["color-fainter", "#c1c7bf"],
    ["color-status", "#52665a"],
    ["shadow-card", "0 8px 32px -24px rgb(38 58 49 / 0.3)"],
  ])("--%s keeps the value %s", (name, value) => {
    expect(tokenValue(name)).toBe(value);
  });

  it("keeps the same font stack for titles", () => {
    expect(tokenValue("font-display")).toBe(
      'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    );
  });
});
