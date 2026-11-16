<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Working in This Repository

This is a public repository for the paniAbi bakery platform. Abril runs the
bakery and is our client. Write all repository content — code, comments,
documentation, branch names, commit messages and pull requests — in English.
The one exception is plans: plan files in `docs/plans/` and Mauricio's
comments on them are written in Spanish, in product language (see
"Plans"). All sample data must be invented.

## Who is on the other side

| Tool        | People         | How to talk                          |
| ----------- | -------------- | ------------------------------------ |
| Codex       | Flor and Jesi  | Product language (next section)      |
| Claude Code | Juan, Mauricio | Technical language (see `CLAUDE.md`) |

Flor and Jesi are not programmers. They direct the work and must understand
every change, but you write the code.

## Talking with Flor and Jesi

- Reply in the language they write in. Files you write stay in English,
  except plans (Spanish).
- Talk about what changes for Abril or the bakery, never about how the code is
  built.
- Use this vocabulary and nothing more technical. The first time a word
  appears in a conversation, add the technical word in brackets so they
  recognise it on GitHub.

  | Say (English)     | Say (Spanish)       | Technical word |
  | ----------------- | ------------------- | -------------- |
  | card              | tarjeta             | ticket         |
  | plan              | plan                | plan           |
  | your working copy | tu copia de trabajo | branch         |
  | save a step       | guardar un paso     | commit         |
  | review request    | pedido de revisión  | pull request   |
  | automatic check   | chequeo automático  | test           |

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
  the plan file has not changed since that move. Mauricio discusses the plan
  in its draft pull request, but only the move approves it: a GitHub
  "Approve" does not count.
- Juan's Trello user: `blacky57`.

## Workflow

| Step                        | Skill              |
| --------------------------- | ------------------ |
| Start a card                | `start-ticket`     |
| Write or revise the plan    | `plan-ticket`      |
| Build the approved plan     | `implement-ticket` |
| See the change working      | `try-it-out`       |
| Run the automatic checks    | `check-work`       |
| Bring in the latest changes | `sync-branch`      |
| Open the review request     | `open-pr`          |
| Answer Juan's review        | `address-review`   |
| Not sure where you are      | `next-step`        |
| Stuck                       | `ask-for-help`     |

Skills live in `.agents/skills/`. Claude Code reads pointers to them in
`.claude/skills/`. If a skill is not there yet, follow the same step in
`CONTRIBUTING.md`.

## Setting up and running the app

Follow `README.md` to install the tools and run the app locally. Use the npm
shortcuts it lists (`npm run dev`, `npm run check`) instead of calling
`npx ...` directly.

## Databases: cards bring their data, Juan approves it

Everyone runs the app against their own local database in Docker
(`docker-compose.yml`). When a card needs to store something new (a field,
a table or sample data), the agent adds it while building the card, and Juan
reviews the data model in the same pull request as the rest of the code.
Nothing reaches `main` without his approval.

- The plan describes in product words what is stored, under "Información
  nueva para guardar" (for example "a product has one category or none").
  A card is not blocked because it needs new data.
- Database changes are built in the first step that needs them, before the
  screens that use them:
  1. Run `npm run db:local` first. If it stops saying that `.env` does not
     point at this computer, stop: never change a database that is not the
     local one (see the `.env` rule below).
  2. Edit `prisma/schema.prisma`, then run
     `npm run db:migrate -- --name <short-description>`. It creates the
     migration file and applies it to the local database, and refuses to
     run if `.env` does not point at this computer.
  3. Add invented sample data for what you added to `prisma/seed.ts`. The
     seed must stay safe to run again. Run `npm run db:local` to check it.
- Migrations only add tables or columns. Deleting or renaming goes in a
  second card, once no code uses the old name.
- If a command offers to reset or erase the database, answer no and stop.
  Never run `prisma migrate reset`, `prisma db push`, or any database
  command against a database that is not the local one.
- Two cards that add data to the same thing (for example, products) are not
  built at the same time. If the plan touches data that another card in
  `Approved Plan` or `In Progress` also changes, say so: Mauricio orders
  them.
- When Juan asks for changes to the data model, address-review applies them
  like any other comment. Until the pull request is merged, the migration
  can still be edited.
- If `.env` points at Neon (a `neon.tech` host, or `npm run db:local` says
  "does not point at this computer"), the person set up the app before the
  local database existed. Tell them, and ask them to follow "Already had the
  app running before the local database?" in `README.md`. They run
  `cp .env.example .env` themselves; never edit or replace `.env` yourself.
- Keep `.env` pointing at the local database (`.env.example`). Only when
  Juan asks for it does someone point it at Neon; then anything they create
  appears on that database: only invented data, and name test products
  `TEST - ...`.
- Neon branches: `production` (live site), `dev` (pull request previews),
  `ci` (GitHub Actions). Vercel migrates `production` and `dev` itself
  (`scripts/vercel-build.mjs`).
- The site has no login yet: only invented sample data.

## Never

- Push to `main`, or push with `--force`.
- Commit `.env`, credentials or real customer data.
- Write application code without an approved plan, or go beyond the plan
  without a new approval.
- Add version ranges (`^`, `~`) in `package.json`.
- Create branches or pull requests by hand. Use the scripts in `scripts/`.

## Plans

- Follow `docs/plans/_template.md`. The whole plan is in Spanish and in
  product language: what changes for Abril, expected behaviour with concrete
  examples, what will be tested (in words), steps. No file names, functions
  or code, so Flor and Jesi can contribute to every part of it.
- When the plan is ready, it is opened as a draft pull request
  (`node scripts/git-open-pr.mjs --draft`). Mauricio comments on it there.
  The same pull request later receives the step commits and is marked ready
  for Juan by open-pr.

## Writing code

- Before implementing, read `docs/code-patterns.md` and the relevant Next.js
  16 guide under `node_modules/next/dist/docs/`.
- You make the technical decisions while building, inside what the approved
  plan allows: its steps and test cases, no new dependencies, and database
  changes only for what "Información nueva para guardar" describes.
  open-pr lists those decisions for Juan, including the data model.
- Make the smallest change that solves the card.
- Every behaviour change gets a test.
- Commit messages follow Conventional Commits: `feat:`, `fix:`, `test:`,
  `docs:`, `chore:`.

## Before a pull request

Run `node scripts/check.mjs` from the repository root. It runs the same checks
as CI (Prisma client, lint, type check, tests and build). Fix every failure
before asking for review.

See `CONTRIBUTING.md` for the human-facing version of this workflow.
