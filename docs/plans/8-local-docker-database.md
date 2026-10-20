# [#8] Local Docker database for development

Trello card: https://trello.com/c/Ckh1OHEY/8-base-de-datos-local-con-docker-para-desarrollo

## 1. What changes for Abril

- **Today:** Flor and Jesi run the app on their computers against the
  `production` database (decision in #5). Every product created while testing
  appears on the live site, and a mistaken command could change Abril's live
  data.
- **After this card:** each person runs the app against their own database on
  their computer, with the same sample products. Testing never touches the
  live site. Nothing changes on the live site itself.
- **How we will know it works:**
  - [ ] On a fresh clone, following the README, `npm run db:local` and
        `npm run dev` show the sample products at
        `http://localhost:3000/products`.
  - [ ] A product created locally does not appear on the live site.
  - [ ] `npm run db:local` refuses to run when `.env` points at Neon.
- **Out of scope:** CI (keeps the Neon `ci` branch), Vercel and preview
  databases (unchanged), any change under `prisma/`, login.
- **Open questions for Abril:** none (no product behaviour changes).

## 2. How we will build it

- **Files** (following `docs/code-patterns.md`):
  - `docker-compose.yml` (new): one `postgres:17.6` service, bound to
    `127.0.0.1:5432` only, invented local-only user/password/database
    (`paniabi`), a named volume so data survives restarts, and a
    `pg_isready` healthcheck.
  - `scripts/db-local.mjs` (new), run with `npm run db:local`:
    1. Loads `.env` (`process.loadEnvFile`); if it is missing, stops and says
       to copy `.env.example`.
    2. Stops unless both `DATABASE_URL` and `DIRECT_URL` point at
       `localhost`, `127.0.0.1` or `::1`. This guard is the reason the
       command is safe to give to Flor, Jesi and their agents.
    3. `docker compose up -d --wait`; if Docker is not running, stops and
       says to open Docker Desktop.
    4. `npx prisma migrate deploy` (applies pending migrations, never resets).
    5. `npx prisma db seed` (the existing seed, which upserts, so it can run
       again safely).
  - `scripts/lib/helpers.mjs`: new pure function `isLocalDatabaseUrl(url)`,
    tested in `scripts/lib/helpers.test.mjs` like `shouldMigrate`.
  - `package.json`: `"db:local": "node scripts/db-local.mjs"`.
  - `.env.example`: both URLs default to the local database (no secrets).
    The Neon URL shapes stay as commented alternatives. Fix the outdated
    "each teammate uses their own Neon database branch" comment.
  - `README.md`: Docker Desktop in the tools table; first-time setup becomes
    `cp .env.example .env` → `npm run db:local` → `npm run dev`, with no URLs
    from Juan; Databases section with a "Local (Docker)" row; "Database
    changes (Juan only)" prepares migrations against the local database
    instead of `dev`; new rows in "Common problems" (Docker not running,
    port 5432 in use, starting from an empty database).
  - `AGENTS.md`: "Databases: only Juan changes them" rewritten. Flor and Jesi
    run against their local database. `npm run db:local` is the only
    database command they may run. The bans on editing `prisma/` and on
    `prisma migrate` / `db push` / `migrate reset` / `db:migrate` /
    `db:seed` stay. The `TEST - ...` rule only applies when someone points
    `.env` at Neon on purpose.
  - `CONTRIBUTING.md`: "Local setup" paragraph updated to match.
  - `.agents/skills/implement-ticket/SKILL.md`: "the database does not
    answer" first suggests opening Docker Desktop and running
    `npm run db:local`, then ask-for-help (Juan).
  - `docs/decisions.md`: "Test migrations only against your own disposable
    Neon branch" becomes "against your local Docker database".
  - `docs/plans/5-shared-database-migrations-by-juan.md`: short note at the
    top that #8 replaces the "local database = `production`" decision.
- **Database change:** no. Nothing under `prisma/` changes; the local
  database is built from the existing migrations and seed.
- **Steps** (each step is one small commit and starts with a test):
  1. Test: `isLocalDatabaseUrl` accepts `localhost`, `127.0.0.1` and `[::1]`
     URLs and rejects Neon hosts, empty and malformed URLs → Change: the
     helper, `docker-compose.yml`, `scripts/db-local.mjs`, the `db:local`
     script and `.env.example`. Anyone can run the app with a database of
     their own.
  2. Test: `npm run lint` (includes `check-skills.mjs`) still passes, and a
     manual run on a fresh clone follows the README end to end → Change:
     README, AGENTS.md, CONTRIBUTING.md, implement-ticket, decisions.md and
     the #5 note. The instructions tell everyone to use the local database.
- **Risks / what the reviewer should look at:**
  - This reverses Juan's #5 decision; Juan should agree before merging.
  - Flor and Jesi need Docker Desktop installed (free for this team size).
    Windows needs WSL 2, which Docker Desktop's installer sets up.
  - Port 5432 may already be used by a Postgres installed on the computer;
    the README explains how to spot it.
  - The local Postgres major version must match the Neon project's, so
    migrations behave the same locally and in production. The plan assumes
    17; Juan confirms it in the Neon console before implementation.
  - Local credentials are committed on purpose: they only work on
    `127.0.0.1` and protect nothing real.
  - After the merge, Flor and Jesi must replace their `.env` with the new
    `.env.example`; until they do, they still use `production`.

## 3. Changes after approval

- 2026-10-19 — `npm run db:local` also runs `npx prisma generate` before the
  seed: on a fresh `npm ci` the Prisma client does not exist yet and
  `prisma/seed.ts` fails with `MODULE_NOT_FOUND`.
- 2026-10-19 — Juan checked the Neon console: the project runs Postgres
  **18**, not 17. `docker-compose.yml` now uses `postgres:18.6`, and the
  volume is mounted at `/var/lib/postgresql`, where Postgres 18+ images keep
  their data. Anyone who already created the local database with 17 must
  erase it once (`docker compose down -v`) and run `npm run db:local` again.
