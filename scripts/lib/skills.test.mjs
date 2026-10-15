import { describe, expect, it } from "vitest";
import { findSkillProblems, parseFrontmatter } from "./skills.mjs";

const full = (name, description = "Use when testing.") =>
  `---\nname: ${name}\ndescription: ${description}\n---\n\n# Full skill\n`;
const pointer = (name, description = "Use when testing.") =>
  `---\nname: ${name}\ndescription: ${description}\n---\n\nRead \`.agents/skills/${name}/SKILL.md\` and follow it exactly.\n`;

describe("parseFrontmatter", () => {
  it("reads fields and body", () => {
    expect(parseFrontmatter(full("start-ticket"))).toEqual({
      fields: { name: "start-ticket", description: "Use when testing." },
      body: "\n# Full skill\n",
    });
  });

  it("accepts Windows line endings", () => {
    expect(
      parseFrontmatter(full("start-ticket").replaceAll("\n", "\r\n")).fields
        .name,
    ).toBe("start-ticket");
  });

  it("returns null without frontmatter", () => {
    expect(parseFrontmatter("# No frontmatter")).toBeNull();
  });
});

describe("findSkillProblems", () => {
  it("accepts matching skills and Claude-only skills", () => {
    expect(
      findSkillProblems(
        [{ folder: "start-ticket", text: full("start-ticket") }],
        [
          { folder: "start-ticket", text: pointer("start-ticket") },
          { folder: "review-pr", text: full("review-pr") },
        ],
      ),
    ).toEqual([]);
  });

  it("reports a missing pointer", () => {
    expect(
      findSkillProblems(
        [{ folder: "start-ticket", text: full("start-ticket") }],
        [],
      ),
    ).toEqual([".claude/skills/start-ticket/SKILL.md is missing."]);
  });

  it("reports different descriptions", () => {
    expect(
      findSkillProblems(
        [{ folder: "start-ticket", text: full("start-ticket", "Use when A.") }],
        [
          {
            folder: "start-ticket",
            text: pointer("start-ticket", "Use when B."),
          },
        ],
      ),
    ).toEqual([
      "start-ticket: the description in .claude/skills differs from .agents/skills.",
    ]);
  });

  it("reports a pointer that does not point to the full skill", () => {
    expect(
      findSkillProblems(
        [{ folder: "start-ticket", text: full("start-ticket") }],
        [{ folder: "start-ticket", text: full("start-ticket") }],
      ),
    ).toEqual([
      ".claude/skills/start-ticket/SKILL.md must point to .agents/skills/start-ticket/SKILL.md.",
    ]);
  });

  it("reports a name that does not match its folder", () => {
    expect(
      findSkillProblems(
        [{ folder: "start-ticket", text: full("start") }],
        [{ folder: "start-ticket", text: pointer("start") }],
      ),
    ).toContain(
      ".agents/skills/start-ticket/SKILL.md: name must be 'start-ticket'.",
    );
  });

  it("reports a multi-line description", () => {
    expect(
      findSkillProblems(
        [{ folder: "start-ticket", text: full("start-ticket", ">-") }],
        [{ folder: "start-ticket", text: pointer("start-ticket", ">-") }],
      ),
    ).toContain(
      ".agents/skills/start-ticket/SKILL.md: write the description on one line.",
    );
  });

  it("reports an unknown Claude-only skill", () => {
    expect(
      findSkillProblems([], [{ folder: "extra", text: full("extra") }]),
    ).toEqual([
      ".claude/skills/extra has no matching .agents/skills/extra and is not a Claude-only skill.",
    ]);
  });
});
