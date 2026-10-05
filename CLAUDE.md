# Instructions for Claude Code

Follow the repository-wide instructions in `AGENTS.md`. They are required for
Claude Code too, especially the rule to read the installed Next.js 16 guides
before changing code.

## Help the team work safely

Flor and Jesi are new to programming. Explain proposed changes in plain,
concrete terms, keep edits small, and avoid unexplained abstractions. Do not
silently skip steps or make unrelated changes. Repository content must be in
English, and all sample bakery data must be invented.

## Git workflow

- Never push directly to `main`.
- Start a ticket branch with `node scripts/ticket-start.mjs <ticket-number> <short-description>`.
- Get Mauricio's plan approval before implementing application changes.
- Synchronise with `node scripts/git-sync.mjs` and open pull requests with
  `node scripts/git-open-pr.mjs`.
- Do not push a feature branch or create a commit unless the user asks you to;
  the start-ticket script itself pushes the branch it creates.
- Juan reviews every pull request. Do not bypass review or CI.

Before finishing code changes, run `node scripts/check.mjs` and
report the PASS/FAIL summary it prints. Never expose, commit, or replace private `.env`
credentials.
