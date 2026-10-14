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
   node scripts/ticket-start.mjs <ticket-number> <short-description>
   ```

   Example: `node scripts/ticket-start.mjs 42 product list page`. The script
   creates and pushes the feature branch; it does not push to `main`.

2. Write a short implementation plan and wait for Mauricio's approval before
   changing application code.
3. Keep the branch up to date with:

   ```bash
   node scripts/git-sync.mjs
   ```

4. Open the pull request with:

   ```bash
   node scripts/git-open-pr.mjs
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

Run this command from the repository root (it runs the same checks as CI: Prisma
client, lint, type check, tests and build) and fix failures before asking for
review:

```bash
node scripts/check.mjs
```

Use `CONTRIBUTING.md` for the complete team workflow and ticket expectations.
