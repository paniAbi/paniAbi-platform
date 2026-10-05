# [#3] Agent workflow skills — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the scripts, documents and skills described in
[`3-agent-workflow-skills-design.md`](3-agent-workflow-skills-design.md) so
Flor and Jesi can take a platform card from Trello to a reviewed pull request
with Codex, and Juan and Mauricio can review plans and pull requests with
Claude Code.

**Architecture:** Git mechanics live in dependency-free Node scripts
(`scripts/*.mjs`) with small pure helpers covered by Vitest. Always-on rules
live in `AGENTS.md` (imported by `CLAUDE.md`); code knowledge lives in
`docs/code-patterns.md`; procedures live in skills — full versions in
`.agents/skills/` for Codex, pointers in `.claude/skills/` for Claude Code,
kept in sync by `scripts/check-skills.mjs` inside `npm run lint`.

**Tech Stack:** Node 22 (built-ins only: `node:child_process`, `node:fs`,
`node:path`, `node:process`), Vitest 5, ESLint 9, GitHub CLI (`gh`, optional
at runtime), Trello connector (used by the agents, never by scripts).

## Global Constraints

- All repository content is in English. Sample data is invented.
- No new dependencies. `package.json` versions stay exact.
- Scripts never push to `main` and never use `--force`.
- Skills call `node scripts/<name>.mjs …`, never `npm run <x> -- …`.
- Scripts must behave the same on Windows (PowerShell and Git Bash) and macOS.
- Trello board: `https://trello.com/b/T0QnE8Ku/paniabi`. Columns:
  `Backlog`, `To Do`, `Planning`, `Approved Plan`, `In Progress`, `To Check`,
  `Done`. Plan approver: Trello user `mauriciocuello3`. Juan's Trello user:
  `blacky57`. Juan's GitHub user: `cuellojuancruz`.
- Skill `description` fields are one line and contain no `": "` and no `" #"`
  (the skill checker reads them without a YAML parser).
- Code style follows the repo's Prettier config: double quotes, semicolons,
  trailing commas. Run `npx prettier --write <files>` on new files.

## Delivery and branches

Four pull requests, each reviewed by Juan, delivered in order:

| PR  | Tasks | Branch                                                                       |
| --- | ----- | ---------------------------------------------------------------------------- |
| 1   | 1–6   | `feat/3-agent-workflow-skills` (already exists; holds the design and plan)  |
| 2   | 7–10  | `feat/3-agent-docs`, started after PR 1 is merged                            |
| 3   | 11–21 | `feat/3-codex-skills`, started after PR 2 is merged                          |
| 4   | 22–23 | `feat/3-review-skills`, started after PR 3 is merged                         |

Branches for PR 2–4 are started with
`node scripts/ticket-start.mjs 3 <description>` (for example
`node scripts/ticket-start.mjs 3 agent docs`).

## File map

| File                                         | Responsibility                                                    | Task |
| -------------------------------------------- | ----------------------------------------------------------------- | ---- |
| `scripts/lib/helpers.mjs`                    | Pure helpers: branch names, ticket parsing, PR title, plan lookup | 1    |
| `scripts/lib/helpers.test.mjs`               | Vitest tests for the helpers                                      | 1    |
| `scripts/lib/git.mjs`                        | Thin wrappers around `git` and other programs                     | 2    |
| `scripts/ticket-start.mjs`                   | Start a ticket branch (replaces `git-start-ticket.sh`)            | 2    |
| `scripts/git-sync.mjs`                       | Merge `main` into the branch (replaces `git-sync.sh`)             | 3    |
| `scripts/git-open-pr.mjs`                    | Push and open/update the PR (replaces `git-open-pr.sh`)           | 4    |
| `scripts/check.mjs`                          | Run the four CI checks with a summary                             | 5    |
| `.gitattributes`                             | LF line endings for everyone                                      | 6    |
| `.github/pull_request_template.md`           | Card and plan links, checks matching CI                           | 6    |
| `docs/code-patterns.md`                      | Code patterns shared by planning, implementing and reviewing      | 7    |
| `docs/plans/_template.md`                    | Plan template                                                     | 7    |
| `AGENTS.md`                                  | Always-on rules for every agent                                   | 8    |
| `CLAUDE.md`                                  | Claude Code specifics                                             | 9    |
| `CONTRIBUTING.md`                            | Human-facing workflow                                             | 10   |
| `scripts/lib/skills.mjs` (+ test)            | Pure skill-folder comparison                                      | 11   |
| `scripts/check-skills.mjs`                   | Fails lint when skill folders disagree                            | 11   |
| `docs/skills-test-checklist.md`              | Behaviour scenarios for the skills                                | 12   |
| `.agents/skills/<9 skills>/SKILL.md`         | Full skills for Flor and Jesi                                     | 13–21|
| `.claude/skills/<9 skills>/SKILL.md`         | Pointers for Claude Code                                          | 13–21|
| `.claude/skills/review-plan/SKILL.md`        | Mauricio's plan review                                            | 22   |
| `.claude/skills/review-pr/SKILL.md`          | Juan's pull request review                                        | 23   |

---

# PR 1 — Node scripts

### Task 1: Pure helpers with tests

**Files:**
- Create: `scripts/lib/helpers.mjs`
- Test: `scripts/lib/helpers.test.mjs`
- Modify: `vitest.config.ts` (the `include` line)

**Interfaces:**
- Produces:
  - `slugify(description: string): string`
  - `branchName(ticket: string, description: string): string` — throws `Error` with a beginner-friendly message
  - `parseBranch(branch: string): { ticket: string, slug: string } | null`
  - `prTitle(branch: string, customTitle?: string | null): string`
  - `findPlanFile(ticket: string, fileNames: string[]): string | null`
  - `repoPathFromRemote(remoteUrl: string): string | null`
  - `parseOpenPrArguments(args: string[]): { bodyFile: string | null, title: string | null }` — throws if `--body-file` has no value

- [ ] **Step 1: Let Vitest find tests under `scripts/`**

In `vitest.config.ts`, replace:

```ts
    include: ["src/**/*.test.{ts,tsx}"],
```

with:

```ts
    include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.mjs"],
```

- [ ] **Step 2: Write the failing tests**

Create `scripts/lib/helpers.test.mjs`:

```js
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
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npx vitest run scripts/lib/helpers.test.mjs`
Expected: FAIL — `Failed to resolve import "./helpers.mjs"`.

- [ ] **Step 4: Write the helpers**

Create `scripts/lib/helpers.mjs`:

```js
// Pure helpers used by the Git scripts. They never run Git, so they are easy
// to test (see helpers.test.mjs).

const MAX_SLUG_LENGTH = 40;

// "Envío de pedidos!" -> "envio-de-pedidos"
export function slugify(description) {
  return description
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-+$/, "");
}

// ("42", "product list") -> "feat/42-product-list"
export function branchName(ticket, description) {
  if (!/^\d+$/.test(ticket)) {
    throw new Error(`the ticket must be a number. You wrote: '${ticket}'`);
  }
  const slug = slugify(description);
  if (!slug) {
    throw new Error("the description must contain letters or numbers.");
  }
  return `feat/${ticket}-${slug}`;
}

// "feat/42-product-list" -> { ticket: "42", slug: "product-list" }
export function parseBranch(branch) {
  const match = /^[a-z]+\/(\d+)-(.+)$/.exec(branch);
  return match ? { ticket: match[1], slug: match[2] } : null;
}

// "feat/42-product-list" -> "[#42] product list"
export function prTitle(branch, customTitle) {
  if (customTitle) return customTitle;
  const parsed = parseBranch(branch);
  return parsed
    ? `[#${parsed.ticket}] ${parsed.slug.replaceAll("-", " ")}`
    : branch;
}

// ("3", ["3-skills.md", ...]) -> "3-skills.md"
export function findPlanFile(ticket, fileNames) {
  return (
    fileNames.find(
      (name) => name.startsWith(`${ticket}-`) && name.endsWith(".md"),
    ) ?? null
  );
}

// "git@github.com:owner/repo.git" -> "owner/repo"
// Also accepts SSH host aliases such as "git@github-work:owner/repo.git".
export function repoPathFromRemote(remoteUrl) {
  const match =
    /^(?:git@[^:]+:|https:\/\/github\.com\/)([\w.-]+\/[\w.-]+?)(?:\.git)?$/.exec(
      remoteUrl,
    );
  return match ? match[1] : null;
}

// ["--body-file", "a.md", "My", "title"] -> { bodyFile: "a.md", title: "My title" }
export function parseOpenPrArguments(args) {
  let bodyFile = null;
  const titleWords = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--body-file") {
      bodyFile = args[index + 1];
      if (!bodyFile) throw new Error("--body-file needs a file name.");
      index += 1;
    } else {
      titleWords.push(args[index]);
    }
  }
  return { bodyFile, title: titleWords.join(" ") || null };
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npx vitest run scripts/lib/helpers.test.mjs`
Expected: PASS, 21 tests.

- [ ] **Step 6: Lint the new files**

Run: `npx prettier --write scripts/lib && npx eslint scripts vitest.config.ts`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add vitest.config.ts scripts/lib/helpers.mjs scripts/lib/helpers.test.mjs
git commit -m "test: add tested helpers for the git scripts (#3)"
```

---

### Task 2: Git wrappers and `ticket-start.mjs`

**Files:**
- Create: `scripts/lib/git.mjs`
- Create: `scripts/ticket-start.mjs`
- Delete: `scripts/git-start-ticket.sh`

**Interfaces:**
- Consumes: `branchName` from Task 1.
- Produces (in `scripts/lib/git.mjs`):
  - `BASE_BRANCH = "main"`
  - `run(program: string, args: string[], options?: { capture?: boolean }): { ok: boolean, stdout: string }` — `ok` is `false` when the program fails **or is not installed**
  - `git(args: string[], options?): { ok, stdout }`
  - `insideRepository(): boolean`
  - `currentBranch(): string`
  - `uncommittedChanges(): string` — empty string when clean
  - `isMerging(): boolean`
  - `stop(...lines: string[]): never` — prints to stderr and exits with code 1

- [ ] **Step 1: Write the Git wrappers**

Create `scripts/lib/git.mjs`:

```js
// Small wrappers around Git and other programs, shared by the scripts.
import { spawnSync } from "node:child_process";
import process from "node:process";

export const BASE_BRANCH = "main";

// Runs a program without a shell, so arguments are passed exactly as given.
// ok is false when the program fails or is not installed.
export function run(program, args, { capture = false } = {}) {
  const result = spawnSync(program, args, {
    encoding: "utf8",
    stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
  });
  return {
    ok: !result.error && result.status === 0,
    stdout: (result.stdout ?? "").trim(),
  };
}

export function git(args, options) {
  return run("git", args, options);
}

export function insideRepository() {
  return git(["rev-parse", "--is-inside-work-tree"], { capture: true }).ok;
}

export function currentBranch() {
  return git(["rev-parse", "--abbrev-ref", "HEAD"], { capture: true }).stdout;
}

export function uncommittedChanges() {
  return git(["status", "--short"], { capture: true }).stdout;
}

export function isMerging() {
  return git(["rev-parse", "-q", "--verify", "MERGE_HEAD"], { capture: true })
    .ok;
}

export function stop(...lines) {
  console.error(lines.join("\n"));
  process.exit(1);
}
```

- [ ] **Step 2: Write `ticket-start.mjs`**

Create `scripts/ticket-start.mjs`:

```js
// Start working on a ticket: creates your branch from an up-to-date main.
// Usage:   node scripts/ticket-start.mjs <ticket-number> <short description>
// Example: node scripts/ticket-start.mjs 42 product list page
import process from "node:process";
import {
  BASE_BRANCH,
  git,
  insideRepository,
  isMerging,
  stop,
  uncommittedChanges,
} from "./lib/git.mjs";
import { branchName } from "./lib/helpers.mjs";

const [ticket, ...words] = process.argv.slice(2);
if (!ticket || words.length === 0) {
  stop(
    "Usage:   node scripts/ticket-start.mjs <ticket-number> <short description>",
    "Example: node scripts/ticket-start.mjs 42 product list page",
  );
}

let branch;
try {
  branch = branchName(ticket, words.join(" "));
} catch (error) {
  stop(`ERROR: ${error.message}`);
}

if (!insideRepository()) {
  stop("ERROR: you are not inside the project folder.");
}

if (isMerging()) {
  stop(
    "STOP: a merge is not finished yet.",
    "Finish it, or undo it with:  git merge --abort",
  );
}

const changes = uncommittedChanges();
if (changes) {
  stop(
    "STOP: you have changes that are not saved in a commit yet.",
    "",
    changes,
    "",
    "Commit or discard them before starting a new ticket.",
  );
}

if (git(["show-ref", "--verify", "--quiet", `refs/heads/${branch}`]).ok) {
  console.log(`That branch already exists. Switching to it: ${branch}`);
  if (!git(["switch", branch]).ok) stop(`ERROR: could not switch to ${branch}.`);
  process.exit(0);
}

console.log(`Updating ${BASE_BRANCH}...`);
if (!git(["switch", BASE_BRANCH]).ok) {
  stop(`ERROR: could not switch to ${BASE_BRANCH}.`);
}
if (!git(["pull", "--ff-only", "origin", BASE_BRANCH]).ok) {
  stop(
    `ERROR: your local ${BASE_BRANCH} could not be updated.`,
    "Ask Juan before doing anything else.",
  );
}

console.log(`Creating branch: ${branch}`);
if (!git(["switch", "-c", branch]).ok) {
  stop(`ERROR: could not create ${branch}.`);
}
if (!git(["push", "-u", "origin", branch]).ok) {
  stop(
    "ERROR: the branch was created on your computer but could not be pushed to GitHub.",
    "Check that you have access to the repository, then run:",
    `    git push -u origin ${branch}`,
  );
}

console.log(
  [
    "",
    `Ready. You are now on '${branch}'.`,
    "Write your plan, get it approved, and then start working.",
  ].join("\n"),
);
```

- [ ] **Step 3: Check the argument guards (no Git changes happen)**

Run: `node scripts/ticket-start.mjs`
Expected: the two `Usage`/`Example` lines, exit code 1.

Run: `node scripts/ticket-start.mjs abc product list`
Expected: `ERROR: the ticket must be a number. You wrote: 'abc'`, exit code 1.

Run (with an uncommitted change, e.g. `echo x >> README.md`): `node scripts/ticket-start.mjs 99 test`
Expected: `STOP: you have changes that are not saved in a commit yet.` Then undo with `git checkout -- README.md`.

- [ ] **Step 4: Delete the bash version and lint**

```bash
git rm scripts/git-start-ticket.sh
npx prettier --write scripts && npx eslint scripts
```

Expected: no lint errors.

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/git.mjs scripts/ticket-start.mjs
git commit -m "feat: port start-ticket script to Node (#3)"
```

---

### Task 3: `git-sync.mjs`

**Files:**
- Create: `scripts/git-sync.mjs`
- Delete: `scripts/git-sync.sh`

**Interfaces:**
- Consumes: `BASE_BRANCH`, `currentBranch`, `git`, `insideRepository`, `isMerging`, `stop`, `uncommittedChanges` from Task 2.

- [ ] **Step 1: Write the script**

Create `scripts/git-sync.mjs`:

```js
// Bring the latest changes from main into your current branch.
// Run this before you start working, and again if your PR shows conflicts.
// Usage: node scripts/git-sync.mjs
import process from "node:process";
import {
  BASE_BRANCH,
  currentBranch,
  git,
  insideRepository,
  isMerging,
  stop,
  uncommittedChanges,
} from "./lib/git.mjs";

if (!insideRepository()) {
  stop(
    "ERROR: you are not inside the project folder.",
    "Open a terminal inside the repository and try again.",
  );
}

if (isMerging()) {
  stop(
    "STOP: a previous merge is not finished yet.",
    "Fix the conflicts and commit, or undo it with:  git merge --abort",
  );
}

const changes = uncommittedChanges();
if (changes) {
  stop(
    "STOP: you have changes that are not saved in a commit yet.",
    "",
    changes,
    "",
    "Commit them first, then run this script again.",
  );
}

const branch = currentBranch();
console.log("Fetching the latest changes...");
if (!git(["fetch", "origin", "--prune"]).ok) {
  stop("ERROR: could not reach GitHub. Check your connection and try again.");
}

if (branch === BASE_BRANCH) {
  if (!git(["pull", "--ff-only", "origin", BASE_BRANCH]).ok) {
    stop(
      `ERROR: your local ${BASE_BRANCH} could not be updated.`,
      "Ask Juan before doing anything else.",
    );
  }
  console.log(`Done. Your ${BASE_BRANCH} is up to date.`);
  process.exit(0);
}

console.log(`Bringing '${BASE_BRANCH}' into your branch '${branch}'...`);
if (git(["merge", "--no-edit", `origin/${BASE_BRANCH}`]).ok) {
  console.log(`Done. Your branch now includes everything from ${BASE_BRANCH}.`);
  process.exit(0);
}

const conflicted = git(["diff", "--name-only", "--diff-filter=U"], {
  capture: true,
}).stdout;

if (!conflicted) {
  stop("ERROR: the merge failed. Ask Juan before doing anything else.");
}

stop(
  "",
  "There is a conflict: the same lines were changed in two places.",
  "Git needs you to choose which version stays.",
  "",
  "Files to fix:",
  ...conflicted.split("\n").map((file) => `    ${file}`),
  "",
  "Open each file, keep the correct version, remove the <<<<<<< ======= >>>>>>> markers, then run:",
  "    git add <file>",
  "    git commit --no-edit",
  "",
  "To undo the merge and go back to how things were:",
  "    git merge --abort",
  "",
  "If you get stuck, ask Juan before doing anything else.",
);
```

- [ ] **Step 2: Check it on the current branch**

Run: `node scripts/git-sync.mjs`
Expected: `Fetching the latest changes...`, then either `Done. Your branch now includes everything from main.` or a merge commit made with no conflicts. Exit code 0.

- [ ] **Step 3: Delete the bash version, lint, commit**

```bash
git rm scripts/git-sync.sh
npx prettier --write scripts && npx eslint scripts
git add scripts/git-sync.mjs
git commit -m "feat: port sync script to Node (#3)"
```

---

### Task 4: `git-open-pr.mjs`

**Files:**
- Create: `scripts/git-open-pr.mjs`
- Delete: `scripts/git-open-pr.sh`

**Interfaces:**
- Consumes: `BASE_BRANCH`, `currentBranch`, `git`, `insideRepository`, `run`, `stop`, `uncommittedChanges` (Task 2); `findPlanFile`, `parseBranch`, `parseOpenPrArguments`, `prTitle`, `repoPathFromRemote` (Task 1).
- Produces: CLI `node scripts/git-open-pr.mjs [--body-file <file>] [title words…]`. If the PR already exists it pushes and prints its URL — skills rely on this to push review fixes.

- [ ] **Step 1: Write the script**

Create `scripts/git-open-pr.mjs`:

```js
// Push your branch and open its pull request, or update it if it already exists.
// Usage: node scripts/git-open-pr.mjs [--body-file <file>] ["optional title"]
import { existsSync, readdirSync } from "node:fs";
import process from "node:process";
import {
  BASE_BRANCH,
  currentBranch,
  git,
  insideRepository,
  run,
  stop,
  uncommittedChanges,
} from "./lib/git.mjs";
import {
  findPlanFile,
  parseBranch,
  parseOpenPrArguments,
  prTitle,
  repoPathFromRemote,
} from "./lib/helpers.mjs";

const PLANS_FOLDER = "docs/plans";
const TEMPLATE = ".github/pull_request_template.md";

if (!insideRepository()) {
  stop("ERROR: you are not inside the project folder.");
}

const branch = currentBranch();
if (branch === BASE_BRANCH) {
  stop(
    `STOP: you are on '${BASE_BRANCH}'. A pull request must come from your own branch.`,
    "Start a ticket first:  node scripts/ticket-start.mjs <number> <description>",
  );
}

const changes = uncommittedChanges();
if (changes) {
  stop(
    "STOP: you have changes that are not saved in a commit yet.",
    "",
    changes,
    "",
    "Commit them first, then run this script again.",
  );
}

let options;
try {
  options = parseOpenPrArguments(process.argv.slice(2));
} catch (error) {
  stop(`ERROR: ${error.message}`);
}

const parsed = parseBranch(branch);
if (!parsed) {
  stop(
    `STOP: '${branch}' is not a ticket branch (expected feat/<number>-<description>).`,
    "Start a ticket first:  node scripts/ticket-start.mjs <number> <description>",
  );
}

const planFiles = existsSync(PLANS_FOLDER) ? readdirSync(PLANS_FOLDER) : [];
if (!findPlanFile(parsed.ticket, planFiles)) {
  stop(
    `STOP: there is no plan for ticket ${parsed.ticket}.`,
    `Expected a file like ${PLANS_FOLDER}/${parsed.ticket}-<description>.md`,
    "Write the plan and get it approved before opening a pull request.",
  );
}

const bodyFile = options.bodyFile ?? TEMPLATE;
if (!existsSync(bodyFile)) {
  stop(`ERROR: the file '${bodyFile}' does not exist.`);
}
const title = prTitle(branch, options.title);

console.log("Pushing your branch...");
if (!git(["push", "-u", "origin", branch]).ok) {
  stop(
    "ERROR: could not push your branch to GitHub.",
    "If GitHub says your branch is behind, run:  node scripts/git-sync.mjs",
    "Then try again.",
  );
}

if (run("gh", ["auth", "status"], { capture: true }).ok) {
  const existing = run(
    "gh",
    [
      "pr",
      "view",
      branch,
      "--json",
      "url,state",
      "--jq",
      'select(.state == "OPEN") | .url',
    ],
    { capture: true },
  );
  if (existing.ok && existing.stdout) {
    console.log(
      [
        "The pull request already exists and now has your new commits:",
        `    ${existing.stdout}`,
      ].join("\n"),
    );
    process.exit(0);
  }

  console.log("Creating the pull request...");
  const created = run("gh", [
    "pr",
    "create",
    "--base",
    BASE_BRANCH,
    "--head",
    branch,
    "--title",
    title,
    "--body-file",
    bodyFile,
  ]);
  if (!created.ok) {
    stop("ERROR: GitHub did not accept the pull request. Ask Juan for help.");
  }
  console.log("Done. Ask Juan for a review.");
  process.exit(0);
}

const remote = git(["remote", "get-url", "origin"], { capture: true }).stdout;
const repoPath = repoPathFromRemote(remote);
console.log(
  [
    "",
    "Your branch is on GitHub, but the 'gh' command is not available here.",
    repoPath
      ? "Open the pull request in your browser with this link:"
      : "Open the repository on GitHub and create the pull request from branch:",
    "",
    repoPath
      ? `    https://github.com/${repoPath}/compare/${BASE_BRANCH}...${branch}?expand=1`
      : `    ${branch}`,
    "",
    `Title:        ${title}`,
    `Description:  copy the contents of ${bodyFile}`,
  ].join("\n"),
);
```

- [ ] **Step 2: Check the guards without pushing**

Run on `main`: `git switch main && node scripts/git-open-pr.mjs; git switch feat/3-agent-workflow-skills`
Expected: `STOP: you are on 'main'...`, exit code 1.

Run on a branch with no plan: `git switch -c feat/999-guard-test && node scripts/git-open-pr.mjs; git switch feat/3-agent-workflow-skills && git branch -D feat/999-guard-test`
Expected: `STOP: there is no plan for ticket 999.` Nothing is pushed.

Run: `node scripts/git-open-pr.mjs --body-file`
Expected: `ERROR: --body-file needs a file name.`

- [ ] **Step 3: Delete the bash version, lint, commit**

```bash
git rm scripts/git-open-pr.sh
npx prettier --write scripts && npx eslint scripts
git add scripts/git-open-pr.mjs
git commit -m "feat: port open-pr script to Node with plan guard (#3)"
```

The real push/PR path is exercised in Task 6, Step 6, when PR 1 itself is opened.

---

### Task 5: `check.mjs` and npm aliases

**Files:**
- Create: `scripts/check.mjs`
- Modify: `package.json` (`scripts` block)

**Interfaces:**
- Produces: `node scripts/check.mjs` — exit 0 only when lint, type check, tests and build all pass; always prints a `PASS`/`FAIL` summary. Skills `check-work`, `open-pr`, `address-review` rely on that summary format.

- [ ] **Step 1: Write the script**

Create `scripts/check.mjs`:

```js
// Run the checks that CI runs, then show a summary.
// All checks run even if one fails, so you see every problem at once.
// Usage: node scripts/check.mjs
import { spawnSync } from "node:child_process";
import process from "node:process";

const CHECKS = [
  { name: "Prisma client", command: "npx prisma generate" },
  { name: "Lint", command: "npm run lint" },
  { name: "Type check", command: "npx tsc --noEmit" },
  { name: "Tests", command: "npm run test -- --run" },
  { name: "Build", command: "npm run build" },
];

const results = CHECKS.map((check) => {
  console.log(`\n=== ${check.name}: ${check.command}`);
  // Fixed command lines with no user input, so using the shell is safe.
  // The shell is needed on Windows, where npm and npx are .cmd files.
  const result = spawnSync(check.command, { shell: true, stdio: "inherit" });
  if (result.error) {
    console.error(
      `Could not run "${check.command}": ${result.error.message}`
    );
  }
  return { name: check.name, passed: result.status === 0 };
});

console.log("\nSummary:");
for (const result of results) {
  console.log(`  ${result.passed ? "PASS" : "FAIL"}  ${result.name}`);
}

if (results.some((result) => !result.passed)) {
  process.exit(1);
}
console.log("\nAll checks passed.");
```

- [ ] **Step 2: Add the npm aliases**

In `package.json`, replace:

```json
    "db:seed": "prisma db seed"
  },
```

with:

```json
    "db:seed": "prisma db seed",
    "check": "node scripts/check.mjs",
    "ticket:start": "node scripts/ticket-start.mjs",
    "git:sync": "node scripts/git-sync.mjs",
    "git:pr": "node scripts/git-open-pr.mjs"
  },
```

- [ ] **Step 3: Run it**

Run: `node scripts/check.mjs`
Expected: five `===` sections, then:

```
Summary:
  PASS  Prisma client
  PASS  Lint
  PASS  Type check
  PASS  Tests
  PASS  Build

All checks passed.
```

If a check fails for a reason unrelated to this ticket, stop and report it.

- [ ] **Step 4: Commit**

```bash
npx prettier --write scripts/check.mjs package.json
git add scripts/check.mjs package.json
git commit -m "feat: add check script that runs all CI checks (#3)"
```

---

### Task 6: Line endings, PR template, doc references, open PR 1

**Files:**
- Create: `.gitattributes`
- Modify: `.github/pull_request_template.md` (whole file)
- Modify: `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md` (script references only; full rewrites come in PR 2)

- [ ] **Step 1: Add `.gitattributes`**

Create `.gitattributes`:

```
# Store text files with LF line endings for everyone (Windows and macOS),
# so diffs only show real changes.
* text=auto eol=lf
```

Run: `git add --renormalize . && git status --short`
Expected: only `.gitattributes` (plus any file that had CRLF endings; those are fine to include).

- [ ] **Step 2: Replace the PR template**

Replace the whole of `.github/pull_request_template.md` with:

```markdown
## Ticket

Trello card:

Plan: docs/plans/

## What this changes

<!-- In two or three lines: what Abril can do now that she could not do before. -->

## How to check it works

<!-- Steps the reviewer can follow. Be specific: which page, what to click, what should appear. -->

1.
2.

## Checklist

- [ ] The plan was approved before I started
- [ ] `node scripts/check.mjs` passes (lint, type check, tests, build)
- [ ] I added or updated a test for this change
- [ ] No real customer data is committed (this repository is public)

## Notes for the reviewer

<!-- Anything you are unsure about, or decisions you made and want a second opinion on. -->
```

- [ ] **Step 3: Update script references in the docs**

```bash
perl -pi -e 's#\./scripts/git-start-ticket\.sh#node scripts/ticket-start.mjs#g; s#\./scripts/git-sync\.sh#node scripts/git-sync.mjs#g; s#\./scripts/git-open-pr\.sh#node scripts/git-open-pr.mjs#g' AGENTS.md CLAUDE.md CONTRIBUTING.md
grep -rn "\.sh" AGENTS.md CLAUDE.md CONTRIBUTING.md README.md
```

Expected: `grep` prints nothing.

In `AGENTS.md` and `CLAUDE.md`, replace the four-command block / sentence about the checks with `node scripts/check.mjs`:

- `AGENTS.md`: replace the code block under "Before opening a pull request" (the four `npm`/`npx` lines) with:

  ```bash
  node scripts/check.mjs
  ```

  and the sentence above it with: "Run this command from the repository root (it runs lint, type check, tests and build, like CI) and fix failures before asking for review:".
- `CLAUDE.md`: replace "run the four checks listed in `AGENTS.md`" with "run `node scripts/check.mjs`".

- [ ] **Step 4: Run all checks**

Run: `node scripts/check.mjs`
Expected: `All checks passed.`

- [ ] **Step 5: Commit**

```bash
git add .gitattributes .github/pull_request_template.md AGENTS.md CLAUDE.md CONTRIBUTING.md
git commit -m "chore: LF line endings, PR template and docs for Node scripts (#3)"
```

- [ ] **Step 6: Open PR 1 with the new script**

Write `.git/PR_BODY.md` following the new template. Card: `https://trello.com/c/Rrpc5lUl/3-crear-el-andamiaje-de-skills`. Plan: `docs/plans/3-agent-workflow-skills.md`. "How to check it works" must contain this manual checklist for Juan (Windows: Codex in PowerShell and Claude Code in Git Bash) and Mauricio (macOS):

1. `node scripts/ticket-start.mjs 999 Prueba de envío` creates `feat/999-prueba-de-envio` and pushes it. Delete it afterwards: `git switch main && git branch -D feat/999-prueba-de-envio && git push origin --delete feat/999-prueba-de-envio`.
2. `node scripts/ticket-start.mjs abc x` prints the number error.
3. `node scripts/git-sync.mjs` on a feature branch merges `main` cleanly.
4. `node scripts/git-open-pr.mjs` on a branch without a plan stops with "there is no plan".
5. `node scripts/check.mjs` prints the summary.

Then run:

```bash
node scripts/git-open-pr.mjs --body-file .git/PR_BODY.md
```

Expected: the branch is pushed and the PR URL is printed (or the compare link if `gh` is unavailable).

---

# PR 2 — Agent documents

Start: `node scripts/ticket-start.mjs 3 agent docs` (after PR 1 is merged).

### Task 7: `docs/code-patterns.md` and the plan template

**Files:**
- Create: `docs/code-patterns.md`
- Create: `docs/plans/_template.md`

- [ ] **Step 1: Write `docs/code-patterns.md`**

```markdown
# Code patterns

Read this before planning or implementing a card. The planning, implementing
and reviewing skills all use it, so the person writing the code, Mauricio
approving the plan and Juan reviewing the pull request judge the work against
the same rules.

Juan maintains this file. When the same review comment appears twice, add it
here.

The products feature (`src/app/products/`) is the reference example.

## Feature slice

Each feature lives in a few files named after it:

| File                             | Responsibility                                        | Example                                  |
| -------------------------------- | ----------------------------------------------------- | ---------------------------------------- |
| `src/app/<feature>/page.tsx`     | Server component: reads data with Prisma and renders  | `src/app/products/page.tsx`              |
| `src/app/<feature>/actions.ts`   | Server actions: validate and write data               | `src/app/products/actions.ts`            |
| `src/components/<feature>/`      | Client components: forms and lists                    | `product-form.tsx`, `product-list.tsx`   |
| `src/lib/<feature>-schema.ts`    | Zod schema shared by the form and the server action   | `src/lib/product-schema.ts`              |

## Validation

- One Zod schema per form, in `src/lib/<feature>-schema.ts`, exporting the
  schema and its inferred type (`ProductFormValues`).
- The form uses it through `zodResolver` (React Hook Form).
- The server action validates again with `safeParse`. Never trust the browser.
- Error messages are full sentences Abril can act on: "Enter a product name."

## Server actions

- The file starts with `"use server"`.
- Return `{ success: true } | { success: false; message: string }`. Do not
  throw errors to the UI.
- Call `revalidatePath("/<feature>")` after writing.

## Data

- Use Prisma only through `@/lib/prisma` (one shared client).
- Store money as integer cents (`priceCents`). Convert at the boundary with
  `Math.round(pesos * 100)` and display with `src/lib/format-money.ts`.
- Pages that read the database export `const dynamic = "force-dynamic"`.
- To change the database: edit `prisma/schema.prisma`, then run
  `npx prisma migrate dev --name <short-name>` against your own Neon branch.
  Never edit an existing migration.
- Sample data in `prisma/seed.ts` is invented.

## UI

- Use the components in `src/components/ui/` (shadcn) before writing new ones.
- Every input has a `Label` with `htmlFor`; errors appear under the field and
  are linked with `aria-describedby`; results are announced with
  `aria-live="polite"`.

## Tests

- Tests live next to the file they test: `*.test.ts` or `*.test.tsx`
  (Vitest and Testing Library).
- Test behaviour as Abril would see it (what appears, what is rejected), not
  implementation details.
- Every behaviour change gets a test, written before the change.

## Recipe: add a new screen

1. If the screen saves data: the schema in `src/lib/<feature>-schema.ts`, with
   a test for what it rejects.
2. If new data is needed: the Prisma model and its migration.
3. The server action in `src/app/<feature>/actions.ts`.
4. The form and list components in `src/components/<feature>/`, with tests.
5. The page in `src/app/<feature>/page.tsx`.
6. Invented sample rows in `prisma/seed.ts`, if useful.

## Open decisions

- Colours are hard-coded hex values in `src/app/products/page.tsx`. Before
  more screens copy them, they should move to theme tokens in
  `src/app/globals.css`.
- The interface text is in English. Confirm with Abril which language the
  screens should use.
```

- [ ] **Step 2: Write `docs/plans/_template.md`**

```markdown
# [#<card number>] <card title>

Trello card: <card link>

## 1. What changes for Abril

<!-- Product language. Flor or Jesi confirm it before asking for approval. -->

- **Today:**
- **After this card:**
- **How we will know it works:**
  - [ ] Abril can …
- **Out of scope:**
- **Open questions for Abril:**
  <!-- Must be empty before asking Mauricio for approval. -->

## 2. How we will build it

<!-- Technical. Mauricio approves it; Juan uses it to review the pull request. -->

- **Files** (following `docs/code-patterns.md`):
- **Database change:** no
- **Steps** (each step is one small commit and starts with a test):
  1. Test: … → Change: …
- **Risks / what the reviewer should look at:**

## 3. Changes after approval

<!-- Any change here moves the card back to Planning for a new approval.
     Add one dated line per change: what changed and why. -->
```

- [ ] **Step 3: Commit**

```bash
npx prettier --write docs/code-patterns.md docs/plans/_template.md
git add docs/code-patterns.md docs/plans/_template.md
git commit -m "docs: add code patterns and plan template (#3)"
```

---

### Task 8: Rewrite `AGENTS.md`

**Files:**
- Modify: `AGENTS.md` (whole file)

- [ ] **Step 1: Replace everything after the Next.js block**

Keep lines from `<!-- BEGIN:nextjs-agent-rules -->` to
`<!-- END:nextjs-agent-rules -->` exactly as they are. Replace everything after
them with:

````markdown
# Working in This Repository

This is a public repository for the paniAbi bakery platform. Abril runs the
bakery and is our client. Write all repository content — code, comments,
documentation, branch names, commit messages and pull requests — in English.
All sample data must be invented.

## Who is on the other side

| Tool        | People           | How to talk                               |
| ----------- | ---------------- | ----------------------------------------- |
| Codex       | Flor and Jesi    | Product language (next section)           |
| Claude Code | Juan, Mauricio   | Technical language (see `CLAUDE.md`)      |

Flor and Jesi are not programmers. They direct the work and must understand
every change, but you write the code.

## Talking with Flor and Jesi

- Reply in the language they write in. Files you write stay in English.
- Talk about what changes for Abril or the bakery, never about how the code is
  built.
- Use this vocabulary and nothing more technical. The first time a word
  appears in a conversation, add the technical word in brackets so they
  recognise it on GitHub.

  | Say (English)     | Say (Spanish)            | Technical word |
  | ----------------- | ------------------------ | -------------- |
  | card              | tarjeta                  | ticket         |
  | plan              | plan                     | plan           |
  | your working copy | tu copia de trabajo      | branch         |
  | save a step       | guardar un paso          | commit         |
  | review request    | pedido de revisión       | pull request   |
  | automatic check   | chequeo automático       | test           |

- Do not paste code, diffs or error output unless they ask. Summarise what
  happened and what you will do next.
- Ask one question at a time and offer options.
- Before each change, say in one or two sentences what will change for Abril
  and wait for their "ok".
- Never decide how the product should behave. If the card does not say, write
  it down as an open question for Abril; Flor and Jesi are the ones who talk
  to her.

Examples:

- ❌ "I'll add a Server Action with Zod validation for the price."
- ✅ "If Abril tries to save a product without a price, the screen will warn
  her before saving it."
- ❌ "Build failed: Type error: Property 'priceCents' does not exist…"
- ✅ "An automatic check found a mistake in the step we just did. I know how
  to fix it — shall I?"

## Roles

- Mauricio prioritises the backlog and approves every plan.
- Juan owns the infrastructure and reviews every pull request
  (GitHub `cuellojuancruz`).
- Flor and Jesi take platform cards and drive them with Codex.

## Trello board

- Board: https://trello.com/b/T0QnE8Ku/paniabi
- The number in a card's URL (`trello.com/c/<id>/42-...`) is the ticket
  number. It is used in the branch name (`feat/42-...`) and the plan file
  (`docs/plans/42-....md`).
- Columns, in order: `Backlog` (not prioritised) → `To Do` → `Planning` →
  `Approved Plan` → `In Progress` → `To Check` → `Done`.
- Labels: `platform` (changes this repository) and `automation` (does not).
  Only `platform` cards use the skills below.
- Plan approver: Trello user `mauriciocuello3`. A plan is approved only when
  the card is in `Approved Plan`, the move was made by `mauriciocuello3`, and
  the plan file has not changed since that move.
- Juan's Trello user: `blacky57`.

## Workflow

| Step                                 | Skill              |
| ------------------------------------ | ------------------ |
| Start a card                         | `start-ticket`     |
| Write or revise the plan             | `plan-ticket`      |
| Build the approved plan              | `implement-ticket` |
| Run the automatic checks             | `check-work`       |
| Bring in the latest changes          | `sync-branch`      |
| Open the review request              | `open-pr`          |
| Answer Juan's review                 | `address-review`   |
| Not sure where you are               | `next-step`        |
| Stuck                                | `ask-for-help`     |

Skills live in `.agents/skills/`. Claude Code reads pointers to them in
`.claude/skills/`.

## Never

- Push to `main`, or push with `--force`.
- Commit `.env`, credentials or real customer data.
- Write application code without an approved plan, or go beyond the plan
  without a new approval.
- Add version ranges (`^`, `~`) in `package.json`.
- Create branches or pull requests by hand. Use the scripts in `scripts/`.

## Writing code

- Before planning or implementing, read `docs/code-patterns.md` and the
  relevant Next.js 16 guide under `node_modules/next/dist/docs/`.
- Make the smallest change that solves the card.
- Every behaviour change gets a test.
- Commit messages follow Conventional Commits: `feat:`, `fix:`, `test:`,
  `docs:`, `chore:`.

## Before a pull request

Run `node scripts/check.mjs` from the repository root. It runs lint, type
check, tests and build, like CI. Fix every failure before asking for review.

See `CONTRIBUTING.md` for the human-facing version of this workflow.
````

- [ ] **Step 2: Check the size**

Run: `wc -l AGENTS.md`
Expected: under 160 lines.

- [ ] **Step 3: Commit**

```bash
npx prettier --write AGENTS.md
git add AGENTS.md
git commit -m "docs: rewrite AGENTS.md for the agent workflow (#3)"
```

---

### Task 9: Rewrite `CLAUDE.md`

**Files:**
- Modify: `CLAUDE.md` (whole file)

- [ ] **Step 1: Replace the file**

```markdown
@AGENTS.md

# Claude Code

## Who uses Claude Code

Juan (infrastructure, reviews every pull request) and Mauricio (manager,
approves plans). Both are technical: the "Talking with Flor and Jesi" rules in
`AGENTS.md` do not apply to the conversation.

Exception: anything Flor or Jesi will read — pull request review comments,
Trello comments, plan feedback — must follow those rules.

## Git workflow

- Never push directly to `main`.
- Start a ticket branch with
  `node scripts/ticket-start.mjs <ticket-number> <short-description>`.
- Get Mauricio's plan approval before implementing application changes.
- Synchronise with `node scripts/git-sync.mjs` and open pull requests with
  `node scripts/git-open-pr.mjs`.
- Do not push a feature branch or create a commit unless the user asks you to;
  the start-ticket script itself pushes the branch it creates.
- Juan reviews every pull request. Do not bypass review or CI.

Before finishing code changes, run `node scripts/check.mjs` and report its
actual results. Never expose, commit, or replace private `.env` credentials.
```

- [ ] **Step 2: Confirm the import works**

Start a new Claude Code session at the repository root and ask: "Which Trello
user approves plans?"
Expected: `mauriciocuello3` (it comes from `AGENTS.md` through `@AGENTS.md`).

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: make CLAUDE.md import AGENTS.md and describe its users (#3)"
```

---

### Task 10: Update `CONTRIBUTING.md` and open PR 2

**Files:**
- Modify: `CONTRIBUTING.md` (section "Working on a platform ticket" and a new "Agent setup" section)

- [ ] **Step 1: Replace the section "Working on a platform ticket"**

Replace everything from `## Working on a platform ticket` up to (not
including) the `---` line before `## Rules` with:

````markdown
## Working on a platform ticket

You work by telling your agent (Codex or Claude Code) what you want, in your
own words. Each step has a skill that knows how to do it safely; the agent
picks it for you.

| You say                                | What happens                                                                 | Skill              |
| -------------------------------------- | ---------------------------------------------------------------------------- | ------------------ |
| "I want to start card 42"              | The agent explains the card, creates your branch, moves the card to Planning | `start-ticket`     |
| "Let's write the plan"                 | You agree on what changes for Abril, then how; the plan goes to Mauricio     | `plan-ticket`      |
| "Let's start building"                 | Only after Mauricio approves: one step at a time, test first, one commit each | `implement-ticket` |
| "Is everything ok?"                    | Runs lint, type check, tests and build, and explains failures                | `check-work`       |
| "Bring the latest changes"             | Merges `main` into your branch and helps with conflicts                      | `sync-branch`      |
| "I'm done"                             | Opens the pull request and moves the card to To Check                        | `open-pr`          |
| "Juan left comments"                   | Explains the review and applies the changes with you                         | `address-review`   |
| "Where am I?" / "What's next?"         | Tells you which step you are on                                              | `next-step`        |
| "I'm stuck"                            | Writes a clear message for Juan or Mauricio on the card                      | `ask-for-help`     |

**The plan checkpoint:** Mauricio approves a plan by moving its card to
**Approved Plan**. The agent will not build anything until he does — it is
much cheaper to fix a plan than a pull request.

### If you need to run the steps yourself

```bash
node scripts/ticket-start.mjs <ticket-number> <short description>
node scripts/git-sync.mjs
node scripts/check.mjs
node scripts/git-open-pr.mjs
```

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/):
`feat:`, `fix:`, `test:`, `docs:`, `chore:`.

### Review

Juan reviews every pull request. CI must be green before it can be merged. If
there are comments, new commits on the same branch update the pull request.
When it is merged, the card moves to **Done**.

````

- [ ] **Step 2: Add "Agent setup" after "Local setup"**

Append at the end of `CONTRIBUTING.md`:

```markdown

## Agent setup

Do this once, after the local setup:

- [ ] Open Codex (Flor, Jesi) or Claude Code (Juan, Mauricio) **in the
      repository folder**. Skills are found from there.
- [ ] Connect Trello to your agent, and make sure your Trello user is a member
      of the board.
- [ ] Install the GitHub CLI (`winget install GitHub.cli` on Windows,
      `brew install gh` on macOS) and log in with `gh auth login`.
- [ ] Check it works: ask your agent "what's next?". It should answer with the
      `next-step` skill.
```

- [ ] **Step 3: Check and commit**

```bash
npx prettier --write CONTRIBUTING.md
node scripts/check.mjs
git add CONTRIBUTING.md
git commit -m "docs: describe the agent workflow in CONTRIBUTING (#3)"
```

Expected: `All checks passed.`

- [ ] **Step 4: Open PR 2**

Write `.git/PR_BODY.md` from the template ("How to check it works": open a
fresh Codex session and a fresh Claude Code session at the repo root and ask
each "Which Trello user approves plans, and how should you talk to Flor?").
Then: `node scripts/git-open-pr.mjs --body-file .git/PR_BODY.md`.

---

# PR 3 — Skills for Flor and Jesi

Start: `node scripts/ticket-start.mjs 3 codex skills` (after PR 2 is merged).

Every skill task (13–21) creates two files:

1. `.agents/skills/<name>/SKILL.md` with the full content given in the task.
2. `.claude/skills/<name>/SKILL.md` with the pointer below, using the **exact
   same** `name` and `description` lines:

```markdown
---
name: <name>
description: <same description>
---

Read `.agents/skills/<name>/SKILL.md` and follow it exactly. It is the shared
source of truth for Codex and Claude Code.
```

Each skill task ends with:

```bash
node scripts/check-skills.mjs
git add .agents/skills/<name> .claude/skills/<name>
git commit -m "feat: add <name> skill (#3)"
```

Expected from `check-skills`: `Skill check passed.`

### Task 11: Skill checker

**Files:**
- Create: `scripts/lib/skills.mjs`
- Test: `scripts/lib/skills.test.mjs`
- Create: `scripts/check-skills.mjs`
- Modify: `package.json` (`lint` script)

**Interfaces:**
- Produces:
  - `CLAUDE_ONLY_SKILLS: string[]` = `["review-plan", "review-pr"]`
  - `parseFrontmatter(text: string): { fields: Record<string, string>, body: string } | null`
  - `findSkillProblems(agentSkills: {folder, text}[], claudeSkills: {folder, text}[]): string[]` — empty array means everything matches

- [ ] **Step 1: Write the failing tests**

Create `scripts/lib/skills.test.mjs`:

```js
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
        [{ folder: "start-ticket", text: pointer("start-ticket", "Use when B.") }],
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
      findSkillProblems([{ folder: "start-ticket", text: full("start") }], [
        { folder: "start-ticket", text: pointer("start") },
      ]),
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
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run scripts/lib/skills.test.mjs`
Expected: FAIL — cannot resolve `./skills.mjs`.

- [ ] **Step 3: Write the comparison logic**

Create `scripts/lib/skills.mjs`:

```js
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
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run scripts/lib/skills.test.mjs`
Expected: PASS, 10 tests.

- [ ] **Step 5: Write the CLI**

Create `scripts/check-skills.mjs`:

```js
// Fails when the skills in .agents/skills (Codex) and the pointers in
// .claude/skills (Claude Code) disagree. Runs as part of `npm run lint`.
// Usage: node scripts/check-skills.mjs
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { findSkillProblems } from "./lib/skills.mjs";

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
    ["Skill check failed:", ...problems.map((problem) => `  - ${problem}`)].join(
      "\n",
    ),
  );
  process.exit(1);
}
console.log("Skill check passed.");
```

- [ ] **Step 6: Hook it into lint**

In `package.json`, replace `"lint": "eslint .",` with:

```json
    "lint": "eslint . && node scripts/check-skills.mjs",
```

Run: `npm run lint`
Expected: ESLint passes, then `Skill check passed.` (no skills yet).

- [ ] **Step 7: Commit**

```bash
npx prettier --write scripts package.json
git add scripts/lib/skills.mjs scripts/lib/skills.test.mjs scripts/check-skills.mjs package.json
git commit -m "feat: check that Codex and Claude Code skills stay in sync (#3)"
```

---

### Task 12: Skills test checklist and baseline

**Files:**
- Create: `docs/skills-test-checklist.md`

- [ ] **Step 1: Write the checklist**

```markdown
# Skills test checklist

Run these scenarios whenever a skill changes, once in Codex and once in Claude
Code, each in a fresh session opened at the repository root.

Use a practice card for the scenarios that touch Trello: a card in `To Do`
named "Practice card — do not build", labelled `platform`. Delete its branch
afterwards.

| #  | Setup                                                         | Say                                  | Expected                                                                 |
| -- | ------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------ |
| 1  | On `main`                                                     | "I want to start the practice card"  | `start-ticket` runs without being named; card moves to `Planning`        |
| 2  | Card in `Planning`, plan pushed                               | "Let's start building"               | Refuses; says Mauricio has not approved the plan                         |
| 3  | Someone other than `mauriciocuello3` moves card to Approved Plan | "Let's start building"            | Refuses; the move was not made by the approver                           |
| 4  | Approved, then the plan file is edited and committed          | "Let's start building"               | Refuses; asks for a new approval                                         |
| 5  | Card description leaves a behaviour undefined                 | "Let's write the plan"               | Adds an open question for Abril instead of deciding                      |
| 6  | Approved plan                                                 | "Let's start building"               | Each step explained in product language, waits for "ok", test first, one commit per step |
| 7  | Branch conflicts with `main`                                  | "Bring the latest changes"           | Explains both sides and asks; does not resolve alone                     |
| 8  | Branch without a plan file                                    | "I'm done"                           | The script stops with "there is no plan"                                 |
| 9  | Pull request with a technical review comment                  | "Juan left comments"                 | Comment translated to product language; changes applied with "ok"       |
| 10 | Each of the states above                                      | "What's next?"                       | Correct step and next skill                                              |

Record each run in the pull request that changed the skills: date, tool,
scenario numbers, pass/fail, and what failed.
```

- [ ] **Step 2: Record the baseline (before any skill exists)**

In Codex at the repo root (skills not yet added), run scenarios 1, 2 and 6
(scenario 2: say "Let's start building card 3"). Write down in a scratch note
what the agent does wrong (for example: starts coding without approval,
explains in technical terms, invents branch names). These notes go in the PR 3
description as the "before" picture, and each skill must fix the failures it
covers.

- [ ] **Step 3: Commit**

```bash
npx prettier --write docs/skills-test-checklist.md
git add docs/skills-test-checklist.md
git commit -m "docs: add skills test checklist (#3)"
```

---

### Task 13: `start-ticket`

**Files:** `.agents/skills/start-ticket/SKILL.md`, `.claude/skills/start-ticket/SKILL.md` (pointer).

- [ ] **Step 1: Write the full skill**

````markdown
---
name: start-ticket
description: Use when the person wants to start working on a new Trello card, for example "I want to start card 42", or pastes a card link to begin. Do not use for a card that was already started (use next-step).
---

# Start ticket

## Purpose

Take a card from `To Do`, explain it in product terms, create the person's
working copy (branch) and move the card to `Planning`.

## Before you start

1. You need the card number or link. If the person did not give it, ask.
2. Read the card with the Trello connector. The board, columns and labels are
   in the "Trello board" section of `AGENTS.md`. Find the card by the number
   in its URL.
3. Check, in this order. If a check fails, stop and explain it in product
   terms:
   - It has the `automation` label: it does not need code. Tell them it is
     solved outside the repository and stop.
   - It has no `platform` label: ask Mauricio to label it (ask-for-help) and
     stop.
   - It is not in `To Do`: if it is in a later column, use next-step. If it is
     in `Backlog`, it is not prioritised yet; Mauricio must move it first.
   - Another person is a member of the card: do not take it. Tell them who
     has it.

## Steps

1. Explain the card in two to four sentences: what Abril needs and why it
   matters for the bakery. Ask: "Does this match what Abril told you?" Wait.
   If they disagree, help them write a comment on the card and stop.
2. Choose a short English description of two to four words from the card
   title (translate it if the card is in Spanish), for example
   `product list page`.
3. Run:

   ```
   node scripts/ticket-start.mjs <card-number> <short english description>
   ```

4. If the script fails, see "When something goes wrong".
5. With the Trello connector, add the person's Trello user as a member of the
   card and move the card to `Planning`.
6. Tell them their working copy is ready and the next step is the plan
   (plan-ticket).

## What to tell the person

Always in their language and following "Talking with Flor and Jesi" in
`AGENTS.md`.

- Start: "Let me read card 42 and tell you what I understand."
- After the script: "I created your working copy (branch) for this card.
  Everything we change stays there until Juan reviews it, so nothing can break
  the version that works."
- End: "Next we write the plan: what will change for Abril and how we'll build
  it. Mauricio approves it before we build anything."

## When something goes wrong

| What the script said                                         | What to do                                                                                                                                                                        |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `STOP: you have changes that are not saved in a commit yet`  | Show which files changed and explain they are unsaved work from before. Ask what they want to do; use next-step to find which card they belong to. Never discard changes without an explicit "yes, discard them". |
| `STOP: a merge is not finished yet`                          | Use sync-branch to finish or undo it.                                                                                                                                             |
| `could not be updated`                                       | Do not try to fix it. Use ask-for-help (Juan).                                                                                                                                    |
| `could not be pushed to GitHub`                              | Probably missing access to the repository. Use ask-for-help (Juan).                                                                                                               |
| `That branch already exists`                                 | The card was started before. Use next-step to see where it was left.                                                                                                              |

## Never

- Create branches with `git` commands directly.
- Take a card that has another member.
- Start an `automation` card or a card from `Backlog`.

## Done when

The person is on `feat/<n>-<description>`, the branch is on GitHub, the card
is in `Planning` with the person as a member, and they know the next step is
plan-ticket.
````

- [ ] **Step 2: Write the pointer, run the checker, commit** (see the PR 3 intro).

---

### Task 14: `plan-ticket`

**Files:** `.agents/skills/plan-ticket/SKILL.md`, `.claude/skills/plan-ticket/SKILL.md` (pointer).

- [ ] **Step 1: Write the full skill**

````markdown
---
name: plan-ticket
description: Use when the person wants to write the plan for their current card, or to revise it after Mauricio's comments. Do not use to write application code (use implement-ticket) or to approve a plan.
---

# Plan ticket

## Purpose

Write `docs/plans/<n>-<description>.md` from the template, with the person
confirming the product part, and hand it to Mauricio for approval.

## Before you start

1. The current branch is `feat/<n>-<description>` (`git branch --show-current`).
   On `main`, use start-ticket.
2. Read card `n` with the Trello connector. It must be in `Planning`. If it is
   in `Approved Plan` or `In Progress` and they want to change the plan, warn
   them that Mauricio will have to approve it again. If they agree, move the
   card back to `Planning`.
3. `git status --short` shows nothing, or only the plan file.

## Steps

1. Gather context: the card's description, checklists and comments. When
   revising, also read the current plan and Mauricio's comments (Trello user
   `mauriciocuello3`) newer than the last plan commit
   (`git log -1 --format=%cI -- docs/plans/`).
2. Read `docs/code-patterns.md`, the code the card touches, and the relevant
   Next.js 16 guide under `node_modules/next/dist/docs/`.
3. New plan only: copy `docs/plans/_template.md` to
   `docs/plans/<n>-<description>.md`, where `<n>-<description>` is the branch
   name without `feat/`.
4. Write part 1, "What changes for Abril". Explain it to the person in their
   language (the file stays in English). Ask whether it matches what Abril
   asked. Anything nobody knows goes into "Open questions for Abril". Never
   fill a gap by guessing.
5. If "Open questions for Abril" is not empty: help them phrase the questions
   for Abril, save the draft (step 8) so it is not lost, and stop here. Do not
   ask for approval. Continue when they come back with answers.
6. Write part 2, "How we will build it": files following
   `docs/code-patterns.md`; whether the database changes; numbered steps where
   each step is one small commit and starts with a test; risks for the
   reviewer. Each step must be explainable in one sentence of product
   language.
7. Explain part 2 in product terms: how many steps and what each one lets
   Abril do. No code.
8. Save and share:

   ```
   git add docs/plans/<n>-<description>.md
   git commit -m "docs: add plan for #<n>"
   git push
   ```

   When revising, use `docs: update plan for #<n>`. If the plan had been
   approved before, add a dated line under "Changes after approval" saying
   what changed and why.
9. Draft a card comment in the person's language:
   "Plan ready for review @mauriciocuello3:
   https://github.com/<owner>/<repo>/blob/<branch>/docs/plans/<file>".
   Take `<owner>/<repo>` from `git remote get-url origin`. Show it to the
   person and post it with the Trello connector after their "ok".
10. Tell them the plan is waiting for Mauricio, and that nothing else happens
    on this card until he moves it to `Approved Plan` or comments.

## What to tell the person

- Start: "First let's agree on what will change for Abril. Then we'll decide
  how to build it."
- Part 2: "We'll do it in three steps: first …, then …, and finally …"
- End: "Mauricio has the plan. When he approves it, tell me 'let's start
  building'."

## When something goes wrong

| Situation                                              | What to do                                                                  |
| ------------------------------------------------------ | --------------------------------------------------------------------------- |
| The card asks for something nobody understands         | Write it as an open question for Abril.                                     |
| The plan needs more than about six steps               | Suggest splitting the card; use ask-for-help to propose it to Mauricio.     |
| `git push` is rejected                                 | Use sync-branch, then push again.                                           |
| Mauricio's comment is unclear                          | Help the person ask him on the card. Do not guess.                          |

## Never

- Write or change application code.
- Move a card to `Approved Plan`.
- Invent requirements, or remove an open question without the person
  confirming Abril's answer.

## Done when

The plan file is committed and pushed, "Open questions for Abril" is empty,
the card is in `Planning` with the comment for Mauricio, and the person knows
they are waiting for approval.
````

- [ ] **Step 2: Write the pointer, run the checker, commit** (see the PR 3 intro).

---

### Task 15: `implement-ticket`

**Files:** `.agents/skills/implement-ticket/SKILL.md`, `.claude/skills/implement-ticket/SKILL.md` (pointer).

- [ ] **Step 1: Write the full skill**

````markdown
---
name: implement-ticket
description: Use when the person wants to start or continue building their card after Mauricio approved the plan, for example "let's start building". Do not use while the plan is waiting for approval or needs changes (use plan-ticket).
---

# Implement ticket

## Purpose

Build the approved plan one step at a time, explaining each step and saving
it as its own commit.

## Before you start

All four approval checks must pass:

1. The current branch is `feat/<n>-<description>`; `n` is the card number.
2. Card `n` is in `Approved Plan`, or in `In Progress` when resuming.
3. In the card's activity (Trello connector), the most recent move into
   `Approved Plan` was made by `mauriciocuello3`. Note the time of that move.
4. The last commit that touched the plan,
   `git log -1 --format=%cI -- docs/plans/<n>-*.md`, is older than that move
   (compare both in UTC).

If any check fails, stop and explain it in product terms, for example
"Mauricio has not approved the plan yet" or "The plan changed after Mauricio
approved it, so he needs to look at it again". Point to plan-ticket or
next-step. Never continue "just this once".

Also: `git status --short` must be empty. If it is not, ask what those changes
are before going on.

## Steps

1. Move the card to `In Progress` if it is not there yet.
2. Read part 2 of the plan and `docs/code-patterns.md`.
3. Find where you are: `git log main..HEAD --oneline`. Steps already done have
   commits ending in `(step k/N, #n)`.
4. For each remaining step `k` of `N`:
   1. Say in one or two sentences what this step changes for Abril. Wait for
      "ok".
   2. Read the Next.js 16 guide under `node_modules/next/dist/docs/` for what
      this step uses.
   3. Write the test first. Run `npx vitest run <test file>` and confirm it
      fails for the expected reason. Tell them: "I wrote an automatic check
      that describes how it should work. It fails because we haven't built it
      yet."
   4. Make the smallest change that makes the test pass, following
      `docs/code-patterns.md`.
   5. Run `npx vitest run`. Every test must pass.
   6. If the step changes something Abril can see, tell them how to look:
      run `npm run dev` and open the exact address (for example
      `http://localhost:3000/products`).
   7. Save the step:

      ```
      git add <the files of this step>
      git commit -m "feat: <what changed> (step k/N, #n)"
      ```

      Use `test:`, `fix:` or `chore:` instead of `feat:` when it fits. Tell
      them: "I saved this step."
5. Database steps, only when the plan says so: edit `prisma/schema.prisma`,
   then run `npx prisma migrate dev --name <short-name>`. It uses the person's
   own database branch from `.env`.
6. When every step is saved, use check-work, then suggest open-pr.

## What to tell the person

- Progress: "Step 2 of 4: now Abril will be able to …"
- End: "All the steps of the plan are built. Let's run the automatic checks
  before sending it to Juan."

## When something goes wrong

| Situation                                                            | What to do                                                                                              |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| A step cannot be done as the plan says, or a new need appears        | Stop and explain what is different. Use plan-ticket to update the plan; the card goes back to `Planning` and Mauricio approves again. |
| A new library seems necessary                                        | That is a plan change (row above).                                                                      |
| A test fails and you do not know why after two attempts              | Stop and use ask-for-help.                                                                              |
| `.env` is missing or the database does not answer                    | Use ask-for-help (Juan). Never write credentials yourself.                                              |

## Never

- Write code that is not in the plan.
- Skip the test, or commit several steps together.
- Touch `.env`, edit an existing migration, or add or upgrade dependencies
  that the plan does not list.

## Done when

Every plan step has its commit, all tests pass, the card is in `In Progress`,
and the next step is check-work, then open-pr.
````

- [ ] **Step 2: Write the pointer, run the checker, commit** (see the PR 3 intro).

---

### Task 16: `check-work`

**Files:** `.agents/skills/check-work/SKILL.md`, `.claude/skills/check-work/SKILL.md` (pointer).

- [ ] **Step 1: Write the full skill**

````markdown
---
name: check-work
description: Use when the person asks whether everything is fine, before opening a review request, or when a check failed on GitHub. Do not use to answer review comments (use address-review).
---

# Check work

## Purpose

Run lint, type check, tests and build — the same checks CI runs — and explain
any failure in plain language.

## Steps

1. Run:

   ```
   node scripts/check.mjs
   ```

   It runs all four checks and ends with a `PASS`/`FAIL` summary.
2. Everything `PASS`: tell them it is all fine and suggest the next step
   (open-pr if the plan is fully built).
3. For each `FAIL`, read its output and explain in one or two sentences what
   kind of problem it is:
   - Lint: "the code doesn't follow the team's writing rules".
   - Type check: "two parts of the code don't fit together".
   - Tests: "an automatic check says <behaviour> does not work as expected".
   - Build: "the app cannot be put together for publishing".
4. If the failure is in a file this branch changed
   (`git diff main...HEAD --name-only`): propose the fix, wait for "ok", fix
   it, commit with `fix: <what> (#<n>)`, and run the checks again.
5. If it is in a file this branch did not change, or you cannot find the
   cause after two attempts: use ask-for-help (Juan).

## Never

- Disable a lint rule, skip a test, or change a test just so it passes.
- Change CI or configuration files to make a check pass.

## Done when

All four checks pass, or the problem is with Juan through ask-for-help.
````

- [ ] **Step 2: Write the pointer, run the checker, commit** (see the PR 3 intro).

---

### Task 17: `sync-branch`

**Files:** `.agents/skills/sync-branch/SKILL.md`, `.claude/skills/sync-branch/SKILL.md` (pointer).

- [ ] **Step 1: Write the full skill**

````markdown
---
name: sync-branch
description: Use when the person wants the latest changes from main, comes back after a break, GitHub says the review request has conflicts, or a push is rejected because the branch is behind. Do not use to start a new card (use start-ticket).
---

# Sync branch

## Purpose

Bring the latest changes from `main` into the person's working copy and handle
conflicts safely.

## Before you start

`git status --short` must be empty. If it is not, explain that there are
unsaved changes. If they belong to the current plan step, offer to save them
as a step first (implement-ticket); otherwise ask what they are.

## Steps

1. Run:

   ```
   node scripts/git-sync.mjs
   ```

2. If it says `Done`: tell them their working copy now has everyone's latest
   changes. Run `npx vitest run` to confirm nothing broke.
3. If it lists conflicted files:
   1. Explain: "You and someone else changed the same part of <file>. Let's
      decide together which version stays."
   2. For each file, read both versions between `<<<<<<<`, `=======` and
      `>>>>>>>`. Explain each side in product terms, for example "your version
      shows the price with two decimals; the other one adds a stock column".
   3. Propose a resolution (often: keep both). Wait for "ok".
   4. Edit the file, remove every marker, then run `git add <file>`.
   5. When every file is resolved, run `git commit --no-edit`.
   6. Use check-work.
4. If the conflict is in files they did not change, in `package-lock.json` or
   `prisma/migrations/`, or you are not sure: run `git merge --abort` (it puts
   everything back as it was) and use ask-for-help (Juan).

## Never

- Resolve a conflict without the person's "ok".
- Keep one side of a whole file without reading both.
- Use `git rebase`, `git reset --hard` or `git push --force`.

## Done when

The merge is finished and the tests pass, or the merge was undone and Juan has
been asked.
````

- [ ] **Step 2: Write the pointer, run the checker, commit** (see the PR 3 intro).

---

### Task 18: `open-pr`

**Files:** `.agents/skills/open-pr/SKILL.md`, `.claude/skills/open-pr/SKILL.md` (pointer).

- [ ] **Step 1: Write the full skill**

````markdown
---
name: open-pr
description: Use when the person says the card is finished and wants it reviewed, for example "I'm done". Do not use while plan steps are missing (use implement-ticket) or to send fixes after review comments (use address-review).
---

# Open pull request

## Purpose

Open the review request (pull request) for Juan, with a clear description, and
move the card to `To Check`.

## Before you start

1. The branch is `feat/<n>-<description>` and `git status --short` is empty.
2. `docs/plans/<n>-*.md` exists and every step in its part 2 has a commit
   (`git log main..HEAD --oneline`).
3. `node scripts/check.mjs` passes. If not, use check-work first.

## Steps

1. Write the description to `.git/PR_BODY.md` (inside `.git`, so it is never
   committed), following `.github/pull_request_template.md`, in English:
   - Trello card: the card link. Plan: the plan file path.
   - What this changes: two or three lines from part 1 of the plan.
   - How to check it works: concrete steps from "How we will know it works"
     (page address, what to click, what appears).
   - Checklist: tick only what is true.
   - Notes for the reviewer: the plan's risks and anything you were unsure
     about.
2. Summarise it to the person in their language. Wait for "ok".
3. Run:

   ```
   node scripts/git-open-pr.mjs --body-file .git/PR_BODY.md
   ```

4. If the script prints a GitHub link instead of creating the review request
   (`gh` is not available), guide them: open the link, paste the title it
   printed, paste the contents of `.git/PR_BODY.md`, and click "Create pull
   request".
5. With the Trello connector, move the card to `To Check` and comment with the
   review request link.
6. Tell them Juan will review it. When he comments, use address-review.

## When something goes wrong

| What the script said                       | What to do                                                       |
| ------------------------------------------ | ---------------------------------------------------------------- |
| `STOP: there is no plan for ticket`        | The plan is missing on this branch. Use next-step.               |
| `could not push your branch`               | Use sync-branch, then run the script again.                      |
| `GitHub did not accept the pull request`   | Use ask-for-help (Juan).                                         |

## Never

- Open a review request with failing checks.
- Tick a checklist item that is not true.

## Done when

The review request exists on GitHub and the card is in `To Check` with its
link.
````

- [ ] **Step 2: Write the pointer, run the checker, commit** (see the PR 3 intro).

---

### Task 19: `address-review`

**Files:** `.agents/skills/address-review/SKILL.md`, `.claude/skills/address-review/SKILL.md` (pointer).

- [ ] **Step 1: Write the full skill**

````markdown
---
name: address-review
description: Use when Juan left comments or requested changes on the person's review request (pull request), or when they ask what Juan said. Do not use before a review request exists (use open-pr).
---

# Address review

## Purpose

Explain Juan's review in product terms and apply the changes with the
person's agreement.

## Before you start

The branch is `feat/<n>-<description>` and has an open review request:
`gh pr view --json url,state,reviewDecision`. If `gh` is not available, ask
the person to paste Juan's comments.

## Steps

1. Read the comments:

   ```
   gh pr view --json number,url,reviews,comments
   gh api repos/<owner>/<repo>/pulls/<number>/comments
   ```

   The second command returns comments on specific lines. Take
   `<owner>/<repo>` from `git remote get-url origin`.
2. For each comment, explain in product terms what Juan asks and why it
   matters. Group them: changes requested, questions, suggestions.
3. If a comment changes what the card does, stop: that is a plan change. Use
   plan-ticket and let Juan know on the review request.
4. For each change: propose it, wait for "ok", apply it, run
   `npx vitest run`, and commit with `fix: <what> (review, #<n>)`.
5. For each question: draft a short answer in English, show it to the person,
   and post it with `gh pr comment <number> --body "<answer>"` only after
   their "ok". For a comment on a specific line, quote the file and line in
   the answer.
6. Run `node scripts/check.mjs`.
7. Send the new commits:

   ```
   node scripts/git-open-pr.mjs
   ```

   It pushes and says the review request already exists.
8. Tell them Juan can look again. The card stays in `To Check`.

## Never

- Dismiss or argue with a comment without the person.
- Post anything on GitHub without their "ok".
- Change things Juan did not ask for.

## Done when

Every comment is answered or applied, the checks pass, and the new commits are
on GitHub.
````

- [ ] **Step 2: Write the pointer, run the checker, commit** (see the PR 3 intro).

---

### Task 20: `next-step`

**Files:** `.agents/skills/next-step/SKILL.md`, `.claude/skills/next-step/SKILL.md` (pointer).

- [ ] **Step 1: Write the full skill**

````markdown
---
name: next-step
description: Use when the person asks where they are or what comes next, seems lost, or comes back to a card after a break. Also use when their review request was merged, to close the card. Do not use to start a new card (use start-ticket).
---

# Next step

## Purpose

Look at the real state and say in plain words which step the person is on and
what comes next. The only action this skill takes is closing a card whose
review request was merged.

## Steps

1. Collect the state without changing anything:
   - `git branch --show-current` and `git status --short`.
   - On `feat/<n>-...`: card `n` (column and latest comments) with the Trello
     connector; whether `docs/plans/<n>-*.md` exists and its "Open questions
     for Abril"; `git log main..HEAD --oneline`; and, if `gh` works,
     `gh pr view --json state,url,reviewDecision`.
2. Use the first row that matches:

   | State                                                                       | Tell them                                    | Next                                   |
   | --------------------------------------------------------------------------- | -------------------------------------------- | -------------------------------------- |
   | Uncommitted changes                                                         | There are unsaved changes; name the files    | Usually implement-ticket, to finish the step |
   | On `main`                                                                   | No card in progress                          | start-ticket with a card from `To Do`  |
   | Review request merged                                                       | The card is finished                         | Offer to close it (step 3)             |
   | Card in `Planning`, no plan file                                            | The plan is not written                      | plan-ticket                            |
   | Card in `Planning`, plan has open questions                                 | Waiting for answers from Abril               | Ask Abril, then plan-ticket            |
   | Card in `Planning`, Mauricio commented after the last plan commit           | Mauricio asked for changes                   | plan-ticket                            |
   | Card in `Planning`, plan pushed, no new comments                            | Waiting for Mauricio                         | Wait                                   |
   | Card in `Approved Plan`, or `In Progress` with plan steps missing           | Ready to build, or k of N steps done         | implement-ticket                       |
   | Card in `In Progress`, every plan step committed                            | Finished building                            | check-work, then open-pr               |
   | Card in `To Check`, changes requested or new comments                       | Juan answered                                | address-review                         |
   | Card in `To Check`, no review yet                                           | Waiting for Juan                             | Wait                                   |
   | Review request approved, not merged                                         | Juan approved it and will merge it           | Wait                                   |

3. Closing a finished card, only after the person's "ok":
   - Move the card to `Done` with the Trello connector.
   - Run `git switch main`, then `node scripts/git-sync.mjs`.
   - Tell them they are ready for the next card.

## Never

- Change files, commit, or move cards, except when closing in step 3.

## Done when

The person knows where they are and which skill comes next.
````

- [ ] **Step 2: Write the pointer, run the checker, commit** (see the PR 3 intro).

---

### Task 21: `ask-for-help` and open PR 3

**Files:** `.agents/skills/ask-for-help/SKILL.md`, `.claude/skills/ask-for-help/SKILL.md` (pointer).

- [ ] **Step 1: Write the full skill**

````markdown
---
name: ask-for-help
description: Use when the person says they are stuck or confused, when another skill says to ask for help, or when you are not sure how to continue safely. Do not use for questions the card or the plan already answer.
---

# Ask for help

## Purpose

Turn being stuck into a clear message for the right person. Team rule: after
twenty minutes stuck, ask.

## Steps

1. Choose who to ask:

   | About                                              | Ask                          | Trello user        |
   | -------------------------------------------------- | ---------------------------- | ------------------ |
   | Git, GitHub access, setup, CI, review comments     | Juan                         | `blacky57`         |
   | Plan, priorities, scope, splitting a card          | Mauricio                     | `mauriciocuello3`  |
   | How the product should behave                      | Abril, through Flor or Jesi  | —                  |

2. Draft a short message in the person's language:
   - Card and step ("Card 42, step 2 of 4").
   - What we were trying to do, in product terms.
   - What happened: a one-line summary. Include the exact error only when
     asking Juan.
   - What we already tried.
   - What we need from them.
3. Show the draft. After their "ok", post it as a card comment with the Trello
   connector, mentioning the Trello user (for example `@blacky57`). For Abril,
   give them the text to send her themselves.
4. Tell them what they can safely do while they wait, if anything.

## Never

- Post without the person's "ok".
- Include `.env` contents, passwords or tokens.
- Try risky fixes while waiting for an answer.

## Done when

The right person has a clear message and the person knows what to do
meanwhile.
````

- [ ] **Step 2: Write the pointer, run the checker, commit** (see the PR 3 intro).

- [ ] **Step 3: Run the checklist and open PR 3**

Run `node scripts/check.mjs` (expected: `All checks passed.`). Run the
scenarios in `docs/skills-test-checklist.md` in Claude Code (Mauricio) and
Codex (Juan, Windows). Fix any skill that fails its scenario and re-run that
scenario. Put the baseline from Task 12 and the results table in
`.git/PR_BODY.md`, then:

```bash
node scripts/git-open-pr.mjs --body-file .git/PR_BODY.md
```

---

# PR 4 — Review skills for Juan and Mauricio

Start: `node scripts/ticket-start.mjs 3 review skills` (after PR 3 is merged).
These skills live only in `.claude/skills/` (no pointer, no `.agents` copy).

### Task 22: `review-plan`

**Files:** Create `.claude/skills/review-plan/SKILL.md`.

- [ ] **Step 1: Write the skill**

````markdown
---
name: review-plan
description: Use when Mauricio wants to review a plan waiting for approval on a Trello card, or asks which plans are waiting. Records his decision on the card.
---

# Review plan

## Purpose

Help Mauricio review a plan and record his decision on the Trello card. The
conversation with Mauricio is technical. Anything posted on the card is read
by Flor and Jesi, so write it in Spanish product language following "Talking
with Flor and Jesi" in `AGENTS.md`.

## Steps

1. Find the card: the number or link Mauricio gives, or list the cards in
   `Planning` whose latest comment says the plan is ready.
2. Read the plan from its branch:

   ```
   git fetch origin
   git ls-tree --name-only origin/<branch> docs/plans/
   git show origin/<branch>:docs/plans/<file>
   ```

3. Review it:
   - Part 1: concrete and in product terms; "How we will know it works" can
     be checked by Abril; "Out of scope" is stated; "Open questions for
     Abril" is empty.
   - Part 2: follows `docs/code-patterns.md`; steps are small (one commit
     each), test first, in a sensible order; database changes are justified;
     no new dependencies without a reason; risks are named.
   - Size: more than about six steps suggests splitting the card.
4. Report to Mauricio: a recommendation (approve or ask for changes) and the
   issues, most important first.
5. Mauricio decides. Never decide for him.
   - Approve: move the card to `Approved Plan` with the Trello connector (this
     records his user as the approver) and comment "Plan aprobado." plus any
     notes.
   - Changes: draft a comment explaining what to change and why; show it;
     post it after his "ok". The card stays in `Planning`.

## Never

- Approve without Mauricio's explicit decision.
- Edit the plan file.

## Done when

The card is in `Approved Plan` with Mauricio's comment, or in `Planning` with
his requested changes.
````

- [ ] **Step 2: Check and commit**

```bash
node scripts/check-skills.mjs
git add .claude/skills/review-plan
git commit -m "feat: add review-plan skill for Mauricio (#3)"
```

Expected: `Skill check passed.`

---

### Task 23: `review-pr` and open PR 4

**Files:** Create `.claude/skills/review-pr/SKILL.md`.

- [ ] **Step 1: Write the skill**

````markdown
---
name: review-pr
description: Use when Juan wants to review a pull request from Flor or Jesi. Compares it with the approved plan and drafts review comments.
---

# Review pull request

## Purpose

Help Juan review a pull request against its approved plan and draft clear
comments. The conversation with Juan is technical. Comments are posted in
English (repository rule); Flor and Jesi read them through address-review, so
each one must say concretely what to change and why.

## Steps

1. Read the pull request:

   ```
   gh pr view <number> --json number,title,body,headRefName,files,commits
   gh pr diff <number>
   gh pr checks <number>
   ```

2. Read the plan from the branch:

   ```
   git fetch origin
   git ls-tree --name-only origin/<branch> docs/plans/
   git show origin/<branch>:docs/plans/<file>
   ```

3. Confirm the approval with the same rule `implement-ticket` uses: the latest
   move of card `n` into `Approved Plan` was made by `mauriciocuello3`, after
   the last commit that touched the plan. If not, that is a blocking issue.
4. Review:
   - Every plan step is implemented, one commit per step
     (`(step k/N, #n)`), and nothing outside the plan unless it is recorded
     under "Changes after approval".
   - Each behaviour change has a test that checks behaviour.
   - `docs/code-patterns.md` is followed.
   - No real customer data, no `.env`, no secrets; versions stay exact; no
     existing migration was edited.
   - CI is green.
5. Report to Juan: blocking, should fix, and minor issues, each with
   `file:line`.
6. Draft the review in a file (for example `.git/REVIEW.md`): one short
   paragraph per issue saying what to change and why.
7. Post only after Juan's "ok":
   `gh pr review <number> --request-changes --body-file .git/REVIEW.md`
   (or `--comment` / `--approve`).
8. If the same feedback appeared in an earlier review, suggest adding it to
   `docs/code-patterns.md`.

## Never

- Post, approve or merge without Juan's "ok".

## Done when

Juan has posted his review, or decided not to.
````

- [ ] **Step 2: Check, commit and open PR 4**

```bash
node scripts/check-skills.mjs
node scripts/check.mjs
git add .claude/skills/review-pr
git commit -m "feat: add review-pr skill for Juan (#3)"
```

Expected: `Skill check passed.` and `All checks passed.`

Test both skills once in Claude Code on a real plan and pull request (PR 3 is
a good candidate for `review-pr`). Write `.git/PR_BODY.md` and run
`node scripts/git-open-pr.mjs --body-file .git/PR_BODY.md`.

---

## After all four PRs are merged

- Juan creates the `platform` and `automation` labels on the board.
- Jesi joins the Trello board (she is not a member yet).
- Each person follows "Agent setup" in `CONTRIBUTING.md`.
- Dress rehearsal: Flor or Jesi take one small real card end to end with Juan
  watching; fixes go into the skills.
