<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Working in This Repository

This is a public project for a bakery management platform. Flor and Jesi are
new to programming, so make changes explicit and easy to follow. Prefer small,
readable steps over clever abstractions. Write code, comments, documentation,
branch names, and commit messages in English. Never use real customer data.

## Team and review

- Mauricio prioritises tickets and approves the plan before implementation.
- Juan owns infrastructure and reviews every pull request.
- Flor and Jesi implement feature tickets.
- Nobody pushes directly to `main`. Changes reach `main` through an approved
  pull request.

## Required ticket workflow

1. Start a ticket branch from an up-to-date `main` with:

   ```bash
   ./scripts/git-start-ticket.sh <ticket-number> <short-description>
   ```

   Example: `./scripts/git-start-ticket.sh 42 product list page`. The script
   creates and pushes the feature branch; it does not push to `main`.

2. Write a short implementation plan and wait for Mauricio's approval before
   changing application code.
3. Keep the branch up to date with:

   ```bash
   ./scripts/git-sync.sh
   ```

4. Open the pull request with:

   ```bash
   ./scripts/git-open-pr.sh
   ```

   Do not push to `main` or bypass the pull request and review workflow.

## Before changing code

- Read the relevant Next.js guide under `node_modules/next/dist/docs/` first.
  This repository uses Next.js 16, whose APIs and conventions may differ from
  older Next.js versions.
- Follow existing patterns and make the smallest change that solves the ticket.
- Keep dependency versions exact in `package.json`; do not add `^` or `~`.
- Never commit `.env`, credentials, or real customer data. Use invented sample
  data only.
- Add or update focused tests for behaviour changes.

## Before opening a pull request

Run these commands from the repository root and fix failures before asking for
review:

```bash
npm run lint
npx tsc --noEmit
npm run test -- --run
npm run build
```

Use `CONTRIBUTING.md` for the complete team workflow and ticket expectations.
