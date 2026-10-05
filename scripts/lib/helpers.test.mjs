import { describe, expect, it } from "vitest";
import {
  branchName,
  findPlanFile,
  parseBranch,
  parseOpenPrArguments,
  prTitle,
  repoPathFromRemote,
  slugify,
} from "./helpers.mjs";

describe("slugify", () => {
  it("turns words into a lowercase dashed slug", () => {
    expect(slugify("Product List page")).toBe("product-list-page");
  });

  it("removes accents and symbols", () => {
    expect(slugify("Envío de pedidos!")).toBe("envio-de-pedidos");
  });

  it("cuts at 40 characters without a trailing dash", () => {
    expect(slugify("abcdefghij abcdefghij abcdefghij abcdef xyz")).toBe(
      "abcdefghij-abcdefghij-abcdefghij-abcdef",
    );
  });
});

describe("branchName", () => {
  it("builds feat/<ticket>-<slug>", () => {
    expect(branchName("42", "product list page")).toBe(
      "feat/42-product-list-page",
    );
  });

  it("rejects a ticket that is not a number", () => {
    expect(() => branchName("abc", "product list")).toThrow(
      "the ticket must be a number",
    );
  });

  it("rejects a description without letters or numbers", () => {
    expect(() => branchName("42", "!!!")).toThrow(
      "the description must contain letters or numbers",
    );
  });
});

describe("parseBranch", () => {
  it("reads the ticket and slug", () => {
    expect(parseBranch("feat/42-product-list")).toEqual({
      ticket: "42",
      slug: "product-list",
    });
  });

  it("returns null for main", () => {
    expect(parseBranch("main")).toBeNull();
  });
});

describe("prTitle", () => {
  it("builds [#n] words from the branch", () => {
    expect(prTitle("feat/42-product-list")).toBe("[#42] product list");
  });

  it("prefers a custom title", () => {
    expect(prTitle("feat/42-product-list", "My title")).toBe("My title");
  });

  it("falls back to the branch name", () => {
    expect(prTitle("experiment")).toBe("experiment");
  });
});

describe("findPlanFile", () => {
  it("finds the plan for the ticket", () => {
    expect(
      findPlanFile("3", ["_template.md", "31-other.md", "3-skills.md"]),
    ).toBe("3-skills.md");
  });

  it("does not confuse ticket 3 with ticket 31", () => {
    expect(findPlanFile("3", ["31-other.md"])).toBeNull();
  });
});

describe("repoPathFromRemote", () => {
  it.each([
    ["git@github.com:paniAbi/paniAbi-platform.git"],
    ["git@github-mauriiac:paniAbi/paniAbi-platform.git"],
    ["https://github.com/paniAbi/paniAbi-platform.git"],
    ["https://github.com/paniAbi/paniAbi-platform"],
  ])("reads owner/repo from %s", (url) => {
    expect(repoPathFromRemote(url)).toBe("paniAbi/paniAbi-platform");
  });

  it("returns null for other hosts", () => {
    expect(repoPathFromRemote("https://gitlab.com/a/b")).toBeNull();
  });
});

describe("parseOpenPrArguments", () => {
  it("reads --body-file and a title", () => {
    expect(
      parseOpenPrArguments(["--body-file", ".git/PR_BODY.md", "My", "title"]),
    ).toEqual({ bodyFile: ".git/PR_BODY.md", title: "My title" });
  });

  it("returns nulls when nothing is passed", () => {
    expect(parseOpenPrArguments([])).toEqual({ bodyFile: null, title: null });
  });

  it("rejects --body-file without a file", () => {
    expect(() => parseOpenPrArguments(["--body-file"])).toThrow(
      "--body-file needs a file name",
    );
  });
});
