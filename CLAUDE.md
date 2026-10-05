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
- Start a ticket branch with `./scripts/git-start-ticket.sh <ticket-number> <short-description>`.
- Get Mauricio's plan approval before implementing application changes.
- Synchronise with `./scripts/git-sync.sh` and open pull requests with
  `./scripts/git-open-pr.sh`.
- Do not push a feature branch or create a commit unless the user asks you to;
  the start-ticket script itself pushes the branch it creates.
- Juan reviews every pull request. Do not bypass review or CI.

Before finishing code changes, run the four checks listed in `AGENTS.md` and
report their actual results. Never expose, commit, or replace private `.env`
credentials.
