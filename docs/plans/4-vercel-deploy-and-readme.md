# [#4] Vercel deploy and README for local setup

Trello card: https://trello.com/c/mldCDpzr/4-deploy-en-vercel-y-readme-para-setup-local

> **Updated by #5** (`docs/plans/5-shared-database-migrations-by-juan.md`):
> there are no personal Neon branches (Flor and Jesi use `production`
> locally, only Juan runs migrations), and the preview branch is called
> `dev` instead of `preview`.

## Goal

1. Flor and Jesi can open the app on the web, and every pull request gets its
   own preview URL.
2. Their Codex agents can follow `README.md` to install the tools and run the
   app on their own computer.
3. We verify the whole workflow end to end: start a ticket, run the checks,
   open a pull request, see the preview, merge, see production.

## Database names

Every Neon branch has one name, used everywhere (plan, README, Vercel):

| Neon branch    | Used by                                                         |
| -------------- | --------------------------------------------------------------- |
| `production`   | The public site (Vercel Production).                            |
| `preview`      | Every pull request preview (Vercel Preview), shared by all PRs. |
| `ci`           | GitHub Actions.                                                 |
| one per person | Each teammate's local development.                              |

## Decisions

| Topic          | Decision                                                                                                    |
| -------------- | ----------------------------------------------------------------------------------------------------------- |
| Hosting        | Vercel, connected to the GitHub repository. `main` deploys to production; each PR gets a preview.           |
| Production URL | https://pani-abi-platform.vercel.app                                                                        |
| Data           | Production uses `production`; previews use `preview`. Each Vercel environment only has its own branch URLs. |
| Access         | Public, no login. Accepted risk while only invented sample data exists (see below).                         |
| Migrations     | `prisma migrate deploy` runs on every Vercel build (production and preview), each against its own branch.   |
| Node version   | 22, the same as CI, pinned with `engines` and `.nvmrc`.                                                     |

### Why previews get their own database

Vercel builds each preview with the code from the pull request, including
`vercel.json` and `scripts/vercel-build.mjs`. If previews had the production
URLs, a pull request that changed the build script (even by mistake) could
migrate production before any review or merge, and a bug in a preview could
change real data. With a separate `preview` branch, the production URLs only
exist in the Production environment, so only merged code can touch production.

One shared `preview` branch, not Neon's integration that creates a branch per
pull request: the free plan allows 10 branches per project, and the database
sleeps when nobody uses it.

Because previews migrate their own database, a preview of a pull request with
a migration works too. If two open pull requests leave `preview` in a
confusing state, Juan resets `preview` from `production` in the Neon console.

### Accepted risk: no login

`/products` is part of the admin: it creates products in the database. With
this plan it is public. That is acceptable only while the data is invented.

- **Login is mandatory before any real data is entered.** Separate ticket.
- Future direction: the customer site is read-only (the order is built in the
  browser and sent by WhatsApp; Abril enters it later in the admin). Group
  admin pages under `/admin/...` from the start, so one login protects the
  whole admin at once.

### Migration rule: only add

The build migrates before it builds. If the build then fails, the previous
version keeps running against the already-changed database. Adding tables or
columns is safe; deleting or renaming breaks the running version.

Rule: **deleting or renaming goes in a second pull request, once nothing
uses the old name.**

## Changes in the repository

1. **`scripts/vercel-build.mjs`** (new): the build Vercel runs.
   - Reuses `run` and `stop` from `scripts/lib/git.mjs`, like the other
     scripts.
   - If `VERCEL_ENV` is `production` or `preview`: run
     `npx prisma migrate deploy`. Locally (no `VERCEL_ENV`) it never migrates.
   - Then run `npm run build` (which already runs `prisma generate`).
   - Stop with a clear message if any step fails.
2. **`vercel.json`** (new): `{ "buildCommand": "node scripts/vercel-build.mjs" }`,
   so the build command lives in the repository instead of only in the
   Vercel dashboard.
3. **`package.json`**: add `"engines": { "node": "22.x" }` so Vercel uses the
   same Node version as CI.
4. **`.nvmrc`** (new): `22`.
5. **`README.md`**: rewrite for a new teammate and their Codex agent:
   - What to install on Windows and macOS: Node 22 with nvm (`nvm use` on
     macOS, `nvm install 22` and `nvm use 22` on Windows), Git, GitHub CLI
     (`gh`), and how to check each one (`node -v`, `git --version`,
     `gh auth status`).
   - First-time setup: clone, `npm ci`, copy `.env.example` to `.env`, ask
     Juan for your own Neon branch URLs, `npm run db:migrate`,
     `npm run db:seed`, `npm run dev`, open `http://localhost:3000/products`.
   - How to copy a Neon URL: Neon → Connect → "Copy snippet", only the
     `postgresql://...` text, no quotes.
   - Day-to-day commands: `npm run ticket:start`, `npm run git:sync`,
     `npm run check`, `npm run git:pr` (the Node scripts from #3).
   - Production and previews: URLs, how deploys happen (merge to `main`),
     which database each one uses, the "only add" migration rule, and that
     only invented data may be entered because the site has no login.
   - Common problems: wrong Node version, missing `.env`, URL pasted with
     extra text, Prisma client not generated, port 3000 busy.
6. **`AGENTS.md`**: add one line pointing agents to the README setup section,
   the "only add" migration rule, and a rule: never run migrations or the
   seed against the `production` or `preview` branch URLs.

## Steps Juan does in the consoles (Claude guides, does not enter secrets)

1. Vercel: import `paniAbi/paniAbi-platform`. **Done.**
2. Vercel: turn off Deployment Protection so previews are public. **Done.**
3. Neon: apply the existing migration and the seed to `production` once.
   **Done.**
4. Neon: create the branch `preview` from `production`.
5. Vercel: change `DATABASE_URL` and `DIRECT_URL` (the `production` URLs) to
   the **Production** environment only, and add the `preview` branch URLs
   for the **Preview** environment only.
6. Redeploy the latest preview and production after step 5.

## Status on 2026-10-14

- Vercel project `pani-abi-platform` (Juan's Hobby account), preset Next.js,
  default build command until this plan is implemented.
- `production` has migration `20260929235502_init` and the sample products,
  applied by hand. https://pani-abi-platform.vercel.app/products works.
- Previews are public and, until step 5, still use `production`.

Lessons for the README:

- The first deploy failed with "the URL must start with the protocol
  `postgresql://`": the value was pasted with extra text.
- Environment variables set in the terminal take priority over `.env`, but
  the commands differ: `export NAME='value'` in Git Bash,
  `$env:NAME = "value"` in PowerShell. Check the `Datasource "db"` host that
  Prisma prints before running a migration.

## Verification (end-to-end test)

1. `npm run check` passes locally on this branch.
2. Push with `npm run git:pr`: CI passes and Vercel posts a preview URL.
3. The preview build log shows `prisma migrate deploy` against `preview`, and
   the preview opens `/products`.
4. Follow the README from a fresh clone in a new folder (as Flor's Codex
   would) and confirm the app runs locally.
5. After merge: the production build log shows `prisma migrate deploy`, and
   the production URL shows `/products`.
6. In production, create a product named `TEST - delete me`, confirm it
   appears, then deactivate it (`isActive = false`) from the Neon SQL editor
   and confirm it disappears.

## Out of scope

- Login (mandatory before real data, separate ticket).
- Moving admin pages under `/admin` (separate ticket).
- A custom domain.
