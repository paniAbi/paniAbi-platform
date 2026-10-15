// Pure logic for scripts/check-skills.mjs: compares the full skills in
// .agents/skills (Codex) with the pointers in .claude/skills (Claude Code).

// Skills that exist only for Claude Code users (Juan and Mauricio).
export const CLAUDE_ONLY_SKILLS = ["review-plan", "review-pr"];

// Reads the "key: value" lines between the first two "---" lines.
export function parseFrontmatter(text) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  if (lines[0] !== "---") return null;
  const end = lines.indexOf("---", 1);
  if (end === -1) return null;

  const fields = {};
  for (const line of lines.slice(1, end)) {
    const match = /^([a-z-]+):\s*(.*)$/.exec(line);
    if (match) fields[match[1]] = match[2].trim();
  }
  return { fields, body: lines.slice(end + 1).join("\n") };
}

function checkOne(skill, root, problems) {
  const file = `${root}/${skill.folder}/SKILL.md`;
  const parsed = parseFrontmatter(skill.text);
  if (!parsed) {
    problems.push(`${file} is missing or has no frontmatter.`);
    return null;
  }
  const { name, description } = parsed.fields;
  if (name !== skill.folder) {
    problems.push(`${file}: name must be '${skill.folder}'.`);
  }
  if (!description) {
    problems.push(`${file}: description is missing.`);
  } else if (description.startsWith(">") || description.startsWith("|")) {
    problems.push(`${file}: write the description on one line.`);
  }
  return parsed;
}

// agentSkills and claudeSkills are arrays of { folder, text }.
// Returns a list of problems; an empty list means everything matches.
export function findSkillProblems(agentSkills, claudeSkills) {
  const problems = [];
  const claudeByFolder = new Map(
    claudeSkills.map((skill) => [skill.folder, skill]),
  );
  const agentFolders = new Set(agentSkills.map((skill) => skill.folder));

  for (const skill of agentSkills) {
    const full = checkOne(skill, ".agents/skills", problems);
    const pointerSkill = claudeByFolder.get(skill.folder);
    if (!pointerSkill) {
      problems.push(`.claude/skills/${skill.folder}/SKILL.md is missing.`);
      continue;
    }
    const pointer = checkOne(pointerSkill, ".claude/skills", problems);
    if (!full || !pointer) continue;

    if (full.fields.description !== pointer.fields.description) {
      problems.push(
        `${skill.folder}: the description in .claude/skills differs from .agents/skills.`,
      );
    }
    const target = `.agents/skills/${skill.folder}/SKILL.md`;
    if (!pointer.body.includes(target)) {
      problems.push(
        `.claude/skills/${skill.folder}/SKILL.md must point to ${target}.`,
      );
    }
  }

  for (const skill of claudeSkills) {
    if (agentFolders.has(skill.folder)) continue;
    if (CLAUDE_ONLY_SKILLS.includes(skill.folder)) {
      checkOne(skill, ".claude/skills", problems);
    } else {
      problems.push(
        `.claude/skills/${skill.folder} has no matching .agents/skills/${skill.folder} and is not a Claude-only skill.`,
      );
    }
  }

  return problems;
}
