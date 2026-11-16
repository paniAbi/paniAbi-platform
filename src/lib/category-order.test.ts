import { describe, expect, it } from "vitest";
import { sortCategoriesByName } from "@/lib/category-order";

describe("sortCategoriesByName", () => {
  it("sorts categories alphabetically in Spanish without separating accents or case", () => {
    const categories = sortCategoriesByName([
      { id: "tortas", name: "Tortas" },
      { id: "budines", name: "budines" },
      { id: "arbol", name: "Árbol" },
    ]);

    expect(categories.map((category) => category.name)).toEqual([
      "Árbol",
      "budines",
      "Tortas",
    ]);
  });
});
