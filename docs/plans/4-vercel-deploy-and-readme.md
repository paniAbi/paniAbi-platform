# [#4] Vercel deploy and README for local setup

Trello card: https://trello.com/c/mldCDpzr/4-deploy-en-vercel-y-readme-para-setup-local

## Goal

1. Flor and Jesi can open the app on the web, and every pull request gets its
   own preview URL.
2. Their Codex agents can follow `README.md` to install the tools and run the
   app on their own computer.
3. We verify the whole workflow end to end: start a ticket, run the checks,
   open a pull request, see the preview, merge, see production.

## Decisions (agreed with Juan)

| Topic           | Decision                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------- |
| Hosting         | Vercel, connected to the GitHub repository. `main` deploys to production; each PR gets a preview. |
| Production data | The main branch of Neon. Nobody uses it for development.                                          |
| Preview data    | The same Neon main branch as production (simplest option, accepted risk).                         |
| Access          | Public, no password. Only invented sample data may be entered.                                    |
| Production URL  | https://pani-abi-platform.vercel.app                                                              |
| Migrations      | Applied automatically only on **production** deploys (see below).                                 |
| Node version    | 22, the same as CI.                                                                               |

### Why migrations only run on production deploys

Previews share the production database. If a preview build ran
`prisma migrate deploy`, an unmerged pull request could change the production
database structure. So the build runs migrations only when Vercel says the
deploy is for production (`VERCEL_ENV=production`), which only happens after a
pull request is merged into `main`.

Consequence to document: a preview of a pull request that adds a migration
will not have the new tables or columns, so those pages may fail in the
preview. Check those changes locally on your own Neon branch instead.

## Changes in the repository

1. **`scripts/vercel-build.mjs`** (new): the build Vercel runs.
   - If `VERCEL_ENV` is `production`: run `npx prisma migrate deploy`.
   - Then run `npm run build` (which already runs `prisma generate`).
   - Stop with a clear message if any step fails.
   - Small, no shell input, same style as the other scripts.
2. **`vercel.json`** (new): `{ "buildCommand": "node scripts/vercel-build.mjs" }`,
   so the build command lives in the repository instead of only in the
   Vercel dashboard.
3. **`package.json`**: add `"engines": { "node": "22.x" }` so Vercel uses the
   same Node version as CI.
4. **`README.md`**: rewrite for a new teammate and their Codex agent:
   - What to install on Windows and macOS: Node 22 (with nvm), Git, GitHub CLI
     (`gh`), and how to check each one (`node -v`, `git --version`,
     `gh auth status`).
   - First-time setup: clone, `npm ci`, copy `.env.example` to `.env`, ask
     Juan for your own Neon branch URLs, `npx prisma migrate dev`,
     `npm run db:seed`, `npm run dev`, open `http://localhost:3000/products`.
   - Day-to-day commands: `npm run ticket:start`, `npm run git:sync`,
     `npm run check`, `npm run git:pr` (the Node scripts from #3).
   - Production: URL, how deploys happen (merge to `main`), previews per pull
     request, that previews share the production data, and that only invented
     data may be entered because the site is public.
   - Common problems: wrong Node version, missing `.env`, Prisma client not
     generated, port 3000 busy.
5. **`AGENTS.md`**: add one line pointing agents to the README setup section,
   and a rule: never run `prisma migrate dev` or `db:seed` against the
   production `DATABASE_URL`.

## Steps Juan does in the browser (Claude guides, does not enter secrets)

1. Sign in to Vercel with GitHub and import `paniAbi/paniAbi-platform`
   (this installs the Vercel GitHub app on the organisation).
2. Add environment variables for **Production and Preview**:
   `DATABASE_URL` (Neon main, pooled) and `DIRECT_URL` (Neon main, direct).
3. Before the first deploy, apply the existing migration and the sample data
   to Neon main once, from Juan's computer: `npx prisma migrate deploy` and
   `npm run db:seed` with the main branch URLs.
4. Copy the production URL into the README.

## Status on 2026-10-14 (infrastructure already done by Juan)

Steps 1–3 above are done, before this plan was approved, because they only
touch Vercel and Neon, not the repository:

- Vercel project `pani-abi-platform` (Juan's Hobby account) imported from
  `paniAbi/paniAbi-platform`, preset Next.js, default build command for now.
- `DATABASE_URL` and `DIRECT_URL` set for Production and Preview, pointing at
  the Neon branch `production` (the default branch, host `ep-wispy-rain-...`).
- `npx prisma migrate deploy` (applied `20260929235502_init`) and
  `npm run db:seed` were run once by hand against that branch.
- Production works: https://pani-abi-platform.vercel.app/products returns 200
  and lists the 7 sample products.

Lessons for the README:

- The first deploy failed with "the URL must start with the protocol
  `postgresql://`": the value was pasted with extra text. Copy only the
  connection string (Neon → Connect → "Copy snippet"), with no quotes.
- Environment variables set in the terminal take priority over `.env`, but
  the commands differ: `export NAME='value'` in Git Bash,
  `$env:NAME = "value"` in PowerShell. Check the `Datasource "db"` host that
  Prisma prints before running a migration.

Until this plan is implemented, any new migration must be applied to
production by hand the same way.

## Verification (end-to-end test)

1. `npm run check` passes locally on this branch.
2. Open this pull request with `npm run git:pr`: CI passes and Vercel posts a
   preview URL on the pull request.
3. The preview opens `/products` and lists the sample products.
4. Follow the README from a fresh clone in a new folder (as Flor's Codex
   would) and confirm the app runs locally.
5. After merge: the production deploy log shows `prisma migrate deploy`
   ran, and the production URL shows `/products`.
6. Create one invented product in production and confirm it appears.

## Out of scope

- Login or any access control (separate ticket if needed).
- A custom domain.
- A separate database for previews.
