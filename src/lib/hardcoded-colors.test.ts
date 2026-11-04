import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { findHardcodedColors } from "@/lib/hardcoded-colors";

describe("findHardcodedColors", () => {
  it.each([
    ['className="text-[#263a31]"', "#263a31"],
    ['className="bg-[#fff]"', "#fff"],
    ['className="shadow-[0_8px_rgba(38,58,49,0.3)]"', "rgba("],
    ["color: rgb(38 58 49);", "rgb("],
    ["color: oklch(0.5 0.1 120);", "oklch("],
    ["color: hsl(120 40% 30%);", "hsl("],
  ])("finds a colour written by hand in %s", (source, found) => {
    expect(findHardcodedColors(source)).toEqual([found]);
  });

  it.each([
    'className="text-ink bg-brand border-line"',
    'className="text-white bg-white/80"',
    'href="/products#top"',
    "const id = 'item-1';",
  ])("accepts %s", (source) => {
    expect(findHardcodedColors(source)).toEqual([]);
  });
});

// Every screen and component takes its colours from the theme tokens in
// src/app/globals.css. If this fails, use a named colour (text-ink,
// bg-brand...) or add a new token there. See docs/code-patterns.md.
describe("source files", () => {
  const sourceRoot = path.resolve(process.cwd(), "src");
  const files = readdirSync(sourceRoot, { recursive: true, encoding: "utf8" })
    .filter((file) => /\.(ts|tsx)$/.test(file) && !/\.test\.tsx?$/.test(file))
    .map((file) => file.replaceAll("\\", "/"))
    // The checker itself has colour examples in its comments.
    .filter((file) => file !== "lib/hardcoded-colors.ts");

  it("finds the source files", () => {
    expect(files).toContain("app/products/page.tsx");
  });

  it.each(files)("src/%s has no colours written by hand", (file) => {
    const source = readFileSync(path.join(sourceRoot, file), "utf8");
    expect(findHardcodedColors(source)).toEqual([]);
  });
});
