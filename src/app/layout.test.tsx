import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import RootLayout, { metadata } from "@/app/layout";

describe("RootLayout", () => {
  it("names the browser tab in Spanish", () => {
    expect(metadata.title).toBe("Productos | paniAbi");
  });

  it("tells the browser and screen readers the page is in Spanish", () => {
    expect(renderToStaticMarkup(<RootLayout>{null}</RootLayout>)).toContain(
      '<html lang="es"',
    );
  });
});
