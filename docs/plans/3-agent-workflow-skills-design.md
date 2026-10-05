# [#3] Agent workflow skills — design

Trello card: https://trello.com/c/Rrpc5lUl/3-crear-el-andamiaje-de-skills

## Goal

Give Flor and Jesi (non-programmers, using Codex on Windows) a set of agent
skills that walk them safely through a platform ticket — from a Trello card to
a reviewed pull request — while Juan (Claude Code, Windows) and Mauricio
(Claude Code, macOS) get skills for reviewing plans and pull requests.

The skills encode the workflow that `AGENTS.md` and `CONTRIBUTING.md` already
describe: card → branch → plan → Mauricio's approval → implementation → sync →
pull request → Juan's review.

## Decisions

| Topic                  | Decision                                                                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Role of the agent      | The agent writes the code; Flor and Jesi direct it and must understand every change (explained before each step, approved with an "ok").   |
| How it talks to them   | Product language only, in the language they write in. Defined once in `AGENTS.md`, applied by every skill.                                 |
| Who uses which tool    | Codex → Flor and Jesi (product language). Claude Code → Juan and Mauricio (technical language).                                            |
| Skill organisation     | One skill per workflow step, triggered by natural language; each skill checks its own preconditions; `next-step` tells you where you are. |
| Git mechanics          | Kept in scripts (deterministic guards), ported from bash to Node so they run the same in PowerShell, Git Bash and macOS.                   |
| Trello                 | Handled by the agent through each person's Trello connector, never by scripts (no Trello API keys in `.env`).                             |
| Plan location          | `docs/plans/<card-number>-<slug>.md`, committed on the ticket branch, linked on the card.                                                  |
| Plan approval signal   | Card is in **Approved Plan**, the move was made by Mauricio's Trello user, and the plan file has not changed since that move.              |
| Code patterns          | One reference document, `docs/code-patterns.md`, read by the planning, implementing and reviewing skills. Owned by Juan.                   |
| Cross-tool layout      | Full skills in `.agents/skills/` (Codex). Thin pointer skills in `.claude/skills/` (Claude Code). No symlinks (they break on Windows).     |

## Trello board

Board: https://trello.com/b/T0QnE8Ku/paniabi

Columns used by the workflow, in order:

`Backlog` → `To Do` → `Planning` → `Approved Plan` → `In Progress` →
`To Check` → `Done`

- The number in a card URL (`trello.com/c/<id>/42-...`) is the ticket number
  used in the branch name (`feat/42-...`) and the plan file name.
- Plan approver: Trello user `mauriciocuello3`.
- Labels `platform` (touches the repository) and `automation` (does not) must
  be created on the board. Only `platform` cards go through these skills.
- Everyone's connected Trello user must be a member of the board.

## Skills

### For Flor and Jesi (Codex; also available in Claude Code)

| Skill              | Triggered by (examples)                          | Preconditions                                                                                                           | What it does                                                                                                                                                                                                                                             |
| ------------------ | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `start-ticket`     | "I want to start card 42"                        | Card is in `To Do`, has the `platform` label, nobody else is assigned                                                   | Explains the card in product terms, assigns the person, runs `ticket-start.mjs`, moves the card to `Planning`.                                                                                                                                           |
| `plan-ticket`      | "let's write the plan", "Mauricio asked changes" | On the ticket branch; card is in `Planning`                                                                             | Reads `docs/code-patterns.md` and the relevant Next.js guide, writes the plan from the template, validates part 1 with the person, commits and pushes it, links it on the card with a comment for Mauricio, then **stops**. Re-reads Mauricio's comments when asked to revise. |
| `implement-ticket` | "let's start building"                           | Approval check (see below) passes; card in `Approved Plan` or `In Progress`                                             | Moves the card to `In Progress`. Executes the plan's steps one by one: explains the step in product terms, waits for "ok", writes the test first, then the change, then commits. If it must deviate from the plan: stops, updates the plan, moves the card back to `Planning`. |
| `check-work`       | "is everything ok?"                              | —                                                                                                                       | Runs `check.mjs` and explains each failure in plain language.                                                                                                                                                                                            |
| `sync-branch`      | "get the latest changes", conflicts in the PR   | No uncommitted changes                                                                                                  | Runs `git-sync.mjs`. On conflict: explains which two changes collide in product terms, proposes a resolution, asks before applying it.                                                                                                                  |
| `open-pr`          | "I'm done"                                       | `check-work` passes; the plan file exists                                                                               | Fills the PR template (what changes for Abril, how to check it, card and plan links), runs `git-open-pr.mjs --body-file`, moves the card to `To Check`, comments the PR link on the card.                                                                |
| `address-review`   | "Juan left comments"                             | An open PR exists                                                                                                       | Reads Juan's comments (via `gh`, or pasted by the person), translates them to product terms, proposes changes, applies them with an "ok", pushes through `git-open-pr.mjs`.                                                                              |
| `next-step`        | "where am I?", "what's next?"                    | —                                                                                                                       | Reads branch, card, plan and PR state and says which step the person is on and what comes next. Its only action: if the PR is merged, offer to close the ticket (card to `Done`, switch back to `main`).                                                |
| `ask-for-help`     | "I'm stuck", or the agent is unsure              | —                                                                                                                       | Drafts a clear message for Juan or Mauricio (what was tried, what happened, what is needed) and, with permission, posts it as a card comment.                                                                                                            |

### For Juan and Mauricio (Claude Code only)

| Skill         | Who      | What it does                                                                                                                                                                         |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `review-plan` | Mauricio | Reads the plan linked on the card, checks it against `docs/code-patterns.md`, flags risks. On approval moves the card to `Approved Plan`; on changes, posts a comment written in product language. |
| `review-pr`   | Juan     | Compares the PR against the approved plan, checks tests and invented sample data, drafts review comments that `address-review` can translate. Suggests adding repeated feedback to `docs/code-patterns.md`. |

Because these two live only in `.claude/skills/`, Codex does not know them. Even
if a card is moved by someone else, `implement-ticket` refuses because the move
was not made by the approver.

### Approval check (used by `implement-ticket`)

1. The current branch is `feat/<n>-...`; `n` is the card number.
2. Card `n` is in `Approved Plan` (or `In Progress` when resuming).
3. In the card's activity, the latest move into `Approved Plan` was made by the
   approver configured in `AGENTS.md`.
4. The latest commit touching `docs/plans/<n>-*.md` is older than that move.

If any check fails, the agent stops and explains what is missing in product
language.

## Skill anatomy

Every `SKILL.md` follows the same structure:

```markdown
---
name: <skill-name>
description: Use when … Do not use when … (use <other-skill>).
---

# <Title>

## Purpose
## Before you start        (preconditions; on failure stop, explain, name the next skill)
## Steps                   (numbered; marks where to wait for an "ok")
## What to tell the person (start, checkpoints, end — with examples)
## When something goes wrong (situation → action table)
## Never
## Done when               (observable end state + next skill)
```

Rules:

- Descriptions say when to use the skill **and when not to**, in English.
- Preconditions are checked against real state (Git, Trello, files), never
  against earlier conversation.
- Skills describe actions ("read the card with the Trello connector"), not
  tool names, so they work in both Codex and Claude Code.
- Skills call `node scripts/<name>.mjs …` directly, not `npm run … -- …`
  (PowerShell's npm shim drops the `--`).
- Each skill stays under about 150 lines; longer detail goes in a file inside
  the skill's folder.

## Plan template (`docs/plans/_template.md`)

```markdown
# [#<n>] <card title>

Trello card: <link>

## 1. What changes for Abril
- **Today:**
- **After this ticket:**
- **How we will know it works:**
  - [ ] Abril can …
- **Out of scope:**
- **Open questions for Abril:** (must be empty before asking for approval)

## 2. How we will build it
- **Files** (following docs/code-patterns.md):
- **Database change:** yes/no
- **Steps** (each step is one small commit, test first):
  1. Test: … → Change: …
- **Risks / what the reviewer should look at:**

## 3. Changes after approval
(Any change here moves the card back to Planning for a new approval.)
```

## Scripts (Node, no new dependencies)

All scripts: never push to `main`, never `--force`, short English messages,
non-zero exit code on failure. The `.sh` versions are deleted.

| Script                         | Replaces              | Keeps                                                                                     | Adds or fixes                                                                                                                                         |
| ------------------------------ | --------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ticket-start.mjs <n> <desc>`  | `git-start-ticket.sh` | Numeric ticket, clean tree, switch to existing branch, `pull --ff-only`, create and push  | Portable slug (fixes the BSD `sed` bug on macOS); stops during an unfinished merge.                                                                   |
| `git-sync.mjs`                 | `git-sync.sh`         | Clean tree, `--ff-only` on `main`, conflict file list, exit 1                             | Explains how to back out (`git merge --abort`).                                                                                                       |
| `git-open-pr.mjs [--body-file]`| `git-open-pr.sh`      | Not from `main`, clean tree, `[#n] slug` title, compare-URL fallback without `gh`         | Stops if `docs/plans/<n>-*.md` is missing; accepts a filled PR body; if the PR already exists, pushes and prints its URL.                             |
| `check.mjs`                    | —                     | —                                                                                         | Runs lint, type check, tests and build; runs all even if one fails; prints a ✓/✗ summary.                                                             |
| `check-skills.mjs`             | —                     | —                                                                                         | Fails if `.agents/skills` and `.claude/skills` disagree on skill names or descriptions. Runs inside `npm run lint`.                                  |

`package.json` gets argument-free aliases for humans: `ticket:start`,
`git:sync`, `git:pr`, `check`.

Pure helpers (slug, ticket number from branch, PR title) live in one small
module with Vitest tests.

## Repository layout

```
AGENTS.md                 always-on rules for everyone
CLAUDE.md                 imports @AGENTS.md; Claude Code users are technical
.gitattributes            * text=auto eol=lf
docs/
  code-patterns.md        code patterns (owned by Juan)
  skills-test-checklist.md
  plans/
    _template.md
    <n>-<slug>.md
.agents/skills/<9 skills>/SKILL.md     full skills for Flor and Jesi
.claude/skills/<9 skills>/SKILL.md     pointers: same name and description, "read and follow .agents/skills/<name>/SKILL.md"
.claude/skills/review-plan/SKILL.md    full, Claude Code only
.claude/skills/review-pr/SKILL.md      full, Claude Code only
scripts/*.mjs
```

## `AGENTS.md` (about 120 lines)

1. Next.js agent-rules block, untouched (regenerated by `next dev`).
2. Who is on the other side: Codex → Flor and Jesi (not programmers); Claude
   Code → Juan and Mauricio (technical).
3. Talking with Flor and Jesi:
   - Their language in chat; repository content stays in English.
   - Talk about what changes for Abril or the bakery, never about how the code
     is built.
   - Fixed vocabulary, shared by both tools: card, plan, your working copy
     (branch), save a step (commit), review request (pull request), automatic
     check (test). The technical word appears once in brackets.
   - No code or stack traces unless asked; summarise what happened and what
     comes next.
   - One question at a time, with options.
   - Never invent product decisions; record them as open questions for Abril.
   - ❌/✅ examples.
4. Roles and approvals.
5. Trello board: URL, columns, labels, approver, approval rule.
6. Workflow table: step → skill. "If you do not know where you are, use
   `next-step`."
7. Never: push to `main`, `--force`, commit `.env` or real data, implement
   without an approved plan, deviate from the plan without re-approval, use
   version ranges in `package.json`.
8. Code: read `docs/code-patterns.md` and the relevant Next.js 16 guide before
   planning or implementing; every behaviour change gets a test.
9. Before a pull request: `node scripts/check.mjs`.

Removed: the step-by-step "Required ticket workflow" section with `.sh`
scripts (now covered by the skills).

## `CLAUDE.md`

```markdown
@AGENTS.md

## Who uses Claude Code
Juan (infrastructure, reviews every PR) and Mauricio (manager, approves plans).
Both are technical: the "Talking with Flor and Jesi" rules do not apply to the
conversation. Exception: anything Flor or Jesi will read — PR review comments,
Trello comments, plan feedback — must follow those rules.

## Git workflow
(existing bullets, with node scripts instead of .sh)
```

Removed: "Help the team work safely" (it targets Flor and Jesi, who do not use
Claude Code).

## Other changes

- `CONTRIBUTING.md`: the workflow section becomes "tell your agent what you
  want to do", with the step → skill table; commands remain as a fallback.
- `.github/pull_request_template.md`: add the plan link and the type-check and
  build checkboxes, matching CI.

## `docs/code-patterns.md` (first version)

Extracted from the existing products slice; Juan completes it:

- Feature slice layout: `app/<feature>/page.tsx` (reads data),
  `app/<feature>/actions.ts` (writes), `components/<feature>/` (forms, lists),
  `lib/<feature>-schema.ts` (validation).
- One Zod schema shared by the form and the server action.
- Server actions return `{ success: true } | { success: false; message }` and
  never throw to the UI.
- Money is stored as integer cents.
- Tests live next to the file (`*.test.ts(x)`).
- A recipe: "to add a new screen: 1, 2, 3…".

## Testing

1. Scripts: Vitest for pure helpers; manual Git checklist on Windows (Juan,
   Codex in PowerShell and Claude Code in Git Bash) and macOS (Mauricio).
2. Skill sync: `check-skills.mjs` in `npm run lint`, enforced by CI.
3. Skill behaviour: `docs/skills-test-checklist.md`, run in Codex and Claude
   Code whenever a skill changes. Skills are written test-first: run each
   scenario without the skill, record the failure, then write the skill.

   | Scenario                                         | Expected                                   |
   | ------------------------------------------------ | ------------------------------------------ |
   | "I want to start card 42"                        | `start-ticket` triggers without its name   |
   | "Let's start building" with the card in Planning | Refuses and explains what is missing       |
   | Flor moves her own card to Approved Plan         | Refuses: not moved by the approver         |
   | Plan edited after approval                       | Asks for a new approval                    |
   | Ambiguous requirement on the card                | Records a question for Abril               |
   | Each implementation step                         | Product-language explanation, waits for ok |
   | Conflict during sync                             | Explains and asks; does not resolve alone  |
   | Opening a PR without a plan                      | The script stops                           |
   | Technical review comment from Juan               | Translated to product language             |
   | "What's next?" at each stage                     | Correct diagnosis                          |

4. Dress rehearsal: Flor or Jesi take one small real ticket end to end, with
   Juan watching.

## Delivery

Four small pull requests, each reviewed by Juan:

1. Node scripts, `.gitattributes`, PR template, script references in docs.
2. `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`, first `docs/code-patterns.md`,
   plan template (can run in parallel with 1).
3. The nine Flor and Jesi skills, their Claude Code pointers,
   `check-skills.mjs`, the skills test checklist.
4. `review-plan` and `review-pr`.

## Setup checklist (per person)

- [ ] Node 22, Git, `npm install` in the repository.
- [ ] Codex (Flor, Jesi) or Claude Code (Juan, Mauricio) opened at the
      repository root.
- [ ] Trello connector enabled, and that Trello user is a board member.
- [ ] `gh` installed (`winget install GitHub.cli` on Windows) and logged in
      (`gh auth login`).
- [ ] Smoke test: ask the agent "what's next?" and get a `next-step` answer.

Before rollout: Juan creates the `platform` and `automation` labels.

## Out of scope

- Automation tickets (no repository work).
- Abril's features (separate tickets).
- Replacing hard-coded colours in `src/app/products/page.tsx` with theme
  tokens (flagged to Juan; worth doing before more screens copy the pattern).
