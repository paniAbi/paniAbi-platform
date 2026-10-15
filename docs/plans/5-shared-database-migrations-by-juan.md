# [#5] Shared database and migrations only by Juan

Trello card: https://trello.com/c/YWqLlisF/5-base-compartida-y-migraciones-solo-por-juan

## Goal

1. Flor and Jesi run the app on their computers against the same database as
   the live site, with no Neon branch of their own.
2. Their work (and their Codex agents) stays on design and features in the
   web app. Only Juan changes the database structure.
3. Pull request previews never touch the live site's database.

## Decisions (Juan)

| Topic                       | Decision                                                                                       |
| --------------------------- | ---------------------------------------------------------------------------------------------- |
| Local database (Flor, Jesi) | The `production` branch. No personal branches.                                                 |
| Who changes the database    | Only Juan: `prisma/schema.prisma`, `prisma/migrations/`, `prisma/seed.ts`.                     |
| Preview database            | A Neon branch `dev`, used only by Vercel Preview. Replaces the `preview` branch planned in #4. |
| Migrations on deploy        | Unchanged from #4: Vercel migrates `production` on merge and `dev` on previews.                |

This changes the #4 plan in two places: there are no personal branches, and
the preview branch is called `dev`.

## Neon branches after this ticket

| Neon branch  | Used by                                                       |
| ------------ | ------------------------------------------------------------- |
| `production` | The live site, and Flor's and Jesi's computers.               |
| `dev`        | Pull request previews, and Juan when he prepares a migration. |
| `ci`         | GitHub Actions.                                               |

## Risks and how we limit them

1. **A migration applied from a computer changes the live site before
   review.** Flor and Jesi never run migration commands; Codex is told so in
   `AGENTS.md`. Juan prepares migrations against `dev` and they reach
   `production` only through the merge (`scripts/vercel-build.mjs`).
2. **`prisma migrate dev` can offer to reset (erase) the database.** Never run
   it with the `production` URLs. `AGENTS.md` says: never run `migrate dev`,
   `migrate reset` or `db push`, and never accept a reset.
3. **Data created while testing locally appears on the live site.** Only
   invented data, and test products are named `TEST - ...`. The site has no
   login yet (see #4), so this was already true for the live site.
4. **A feature needs a new column or table.** Flor or Jesi stop and ask
   Juan. Juan adds the migration in his own pull request first; the feature
   pull request comes after it is merged.

## Changes in the repository

1. **`README.md`**
   - First-time setup for Flor and Jesi: `npm ci`, `.env` with the
     `production` URLs that Juan sends privately, `npm run dev`. Remove the
     `db:migrate` and `db:seed` steps from their path (the database is
     already set up).
   - Databases section: the new table above, and that anything created
     locally appears on the live site.
   - New short section "Database changes (Juan only)": point `.env` at `dev`,
     `npm run db:migrate` to create and apply the migration there, open a
     pull request; the merge applies it to `production`. Keep the "migrations
     only add" rule from #4.
   - Common problems: remove the row that tells people to run
     `npm run db:migrate`; replace it with "ask Juan".
2. **`AGENTS.md`**
   - Do not edit `prisma/schema.prisma`, `prisma/migrations/` or
     `prisma/seed.ts`, and do not run `prisma migrate`, `prisma db push`,
     `prisma migrate reset` or `npm run db:migrate` / `db:seed`. If a task
     needs a database change, stop and tell the person to ask Juan.
   - Replace the "one branch per person" line with the new branch table.
3. **`CONTRIBUTING.md`**: replace "each person has their own Neon database
   branch" with the shared database rule and "database changes go through
   Juan".
4. **`.github/CODEOWNERS`** (new): `/prisma/ @cuellojuancruz`, so GitHub
   always asks Juan to review any change under `prisma/`.
5. **`docs/plans/4-vercel-deploy-and-readme.md`**: add a short note at the
   top that #5 replaces the personal branches and renames `preview` to `dev`.

## Steps Juan does in the consoles (Claude guides, does not enter secrets)

1. Neon: create the branch `dev` from `production`.
2. Vercel: set the current `production` URLs for **Production** only, and the
   `dev` URLs for **Preview** only. Redeploy the latest preview.
3. Send Flor and Jesi the two `production` URLs privately (never in GitHub or
   Trello: the repository is public).

## Verification

1. `npm run check` passes.
2. The preview build log for this pull request shows
   `Database migrations (preview)` against the `dev` host, not
   `production`.
3. Fresh clone in a new folder, `.env` with the `production` URLs, follow the
   README: `npm run dev` shows the sample products at
   `http://localhost:3000/products` with no migration step.
4. Ask a Codex session (or Claude) to "add a phone column to products": it
   refuses to edit `prisma/` and says to ask Juan.
5. After merge, the production deploy still migrates `production` (no
   pending migrations) and the live site works.

## Out of scope

- Login (still required before real data, separate ticket).
- Blocking database changes with a CI check; CODEOWNERS and the agent rules
  are enough for now.
