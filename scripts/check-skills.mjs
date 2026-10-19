// Fails when the skills in .agents/skills (Codex) and the pointers in
// .claude/skills (Claude Code) disagree. Runs as part of `npm run lint`.
// Usage: node scripts/check-skills.mjs
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { goToRepositoryRoot } from "./lib/git.mjs";
import { findSkillProblems } from "./lib/skills.mjs";

goToRepositoryRoot();

function readSkills(root) {
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const file = path.join(root, entry.name, "SKILL.md");
      return {
        folder: entry.name,
        text: existsSync(file) ? readFileSync(file, "utf8") : "",
      };
    });
}

const problems = findSkillProblems(
  readSkills(".agents/skills"),
  readSkills(".claude/skills"),
);

if (problems.length > 0) {
  console.error(
    [
      "Skill check failed:",
      ...problems.map((problem) => `  - ${problem}`),
    ].join("\n"),
  );
  process.exit(1);
}
console.log("Skill check passed.");
