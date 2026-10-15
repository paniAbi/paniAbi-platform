# paniAbi Platform

A product and operations workspace for the paniAbi bakery team.

- **Live site:** https://pani-abi-platform.vercel.app/products
- **Team workflow:** [CONTRIBUTING.md](CONTRIBUTING.md)
- **Rules for coding agents (Codex, Claude Code):** [AGENTS.md](AGENTS.md)

## Stack

Next.js App Router, TypeScript, React, Tailwind CSS, shadcn/ui, Prisma,
PostgreSQL on Neon, Zod, React Hook Form, Vitest, ESLint and Prettier.

## 1. Install the tools (once per computer)

You need four programs. After installing each one, run its check command in
a new terminal; it must print a version (or "Logged in") without errors.

| Tool                  | Windows                                            | macOS                                                                       | Check               |
| --------------------- | -------------------------------------------------- | --------------------------------------------------------------------------- | ------------------- |
| Git                   | `winget install --id Git.Git -e`                   | `xcode-select --install`                                                    | `git --version`     |
| nvm (Node versions)   | `winget install --id CoreyButler.NVMforWindows -e` | [nvm install script](https://github.com/nvm-sh/nvm#installing-and-updating) | `nvm --version`     |
| Node 22 (through nvm) | `nvm install 22` then `nvm use 22`                 | `nvm install` then `nvm use` (reads `.nvmrc`)                               | `node -v` → `v22.x` |
| GitHub CLI            | `winget install --id GitHub.cli -e`                | `brew install gh`                                                           | `gh auth status`    |

Then sign in to GitHub once with `gh auth login` (choose GitHub.com, HTTPS,
and "Login with a web browser").

Close and reopen the terminal after installing, so it finds the new programs.

## 2. Run the app on your computer (first time)

1. Clone the repository and enter its folder:

   ```bash
   git clone https://github.com/paniAbi/paniAbi-platform.git
   cd paniAbi-platform
   ```

2. Install the exact dependency versions from `package-lock.json`:

   ```bash
   npm ci
   ```

3. Create your `.env` file from the example:

   ```bash
   cp .env.example .env
   ```

   Juan sends you two URLs privately (never in GitHub or Trello: this
   repository is public). Paste them in `.env`, inside the quotes that are
   already there: `DATABASE_URL` (the host contains `-pooler`) and
   `DIRECT_URL` (without `-pooler`). Paste only the text that starts with
   `postgresql://`.

   The database is already set up: you do not need to create tables or add
   sample data.

4. Start the app and open http://localhost:3000/products:

   ```bash
   npm run dev
   ```

   Stop it with `Ctrl+C`.

## 3. Day-to-day commands

| What you want to do                         | Command                                        |
| ------------------------------------------- | ---------------------------------------------- |
| Start a ticket (creates your branch)        | `npm run ticket:start -- 42 product list page` |
| Bring the latest `main` into your branch    | `npm run git:sync`                             |
| Run the app                                 | `npm run dev`                                  |
| Run every check CI runs (do it before a PR) | `npm run check`                                |
| Push your branch and open the pull request  | `npm run git:pr`                               |

The full flow (plan, approval, review) is in [CONTRIBUTING.md](CONTRIBUTING.md).

## 4. Databases

Each Neon branch has one name and one job:

| Neon branch  | Used by                                                       |
| ------------ | ------------------------------------------------------------- |
| `production` | The live site, and Flor's and Jesi's computers.               |
| `dev`        | Pull request previews, and Juan when he prepares a migration. |
| `ci`         | GitHub Actions.                                               |

When you run the app on your computer you use the **same database as the
live site**:

- Anything you create while testing appears on the live site. Only invented
  data, and name test products `TEST - ...`.
- **Only Juan changes the database structure.** Do not edit
  `prisma/schema.prisma`, `prisma/migrations/` or `prisma/seed.ts`, and do
  not run `npm run db:migrate`, `npm run db:seed` or any `prisma migrate` /
  `prisma db push` command. If your feature needs a new field or table,
  stop and ask Juan; he adds it first in his own pull request.

### Database changes (Juan only)

1. Point your `.env` at the `dev` branch.
2. Change `prisma/schema.prisma` and run `npm run db:migrate`: it creates the
   migration file and applies it to `dev`.
3. Open a pull request. Its preview migrates `dev`; the merge migrates
   `production` (`scripts/vercel-build.mjs`).
4. Point your `.env` back at `production`.

**Migrations only add.** Adding tables or columns is safe. Deleting or
renaming something goes in a second pull request, once no code uses the old
name, because the live site keeps running the old code while the new version
builds. Never run `prisma migrate dev` or `prisma migrate reset` with the
`production` URLs: they can erase the database.

## 5. Live site and previews

- Every merge into `main` publishes the live site automatically:
  https://pani-abi-platform.vercel.app
- Every pull request gets its own preview link. Vercel posts it as a comment
  on the pull request. Previews use the `dev` database, so they never change
  the live data.
- Before building, Vercel applies pending migrations to that environment's
  database (`scripts/vercel-build.mjs`). On your computer the build never
  migrates.
- **The site has no login yet.** Anyone with the link can see it and create
  products. Only enter invented sample data. A login is required before any
  real data goes in.

## 6. Common problems

| You see                                                                      | What to do                                                                                                         |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `node -v` is not `v22...`, or npm warns about `engines`                      | Run `nvm use 22` (Windows) or `nvm use` (macOS), then try again.                                                   |
| `Environment variable not found: DATABASE_URL`                               | You have no `.env` file. Do step 3 of section 2.                                                                   |
| `the URL must start with the protocol postgresql://`                         | The URL in `.env` has extra text. Keep only the part that starts with `postgresql://`.                             |
| `Cannot find module '.prisma/client'` or `@prisma/client did not initialize` | Run `npx prisma generate`.                                                                                         |
| `The table ... does not exist`                                               | Do not try to fix the database yourself. Ask Juan.                                                                 |
| `Port 3000 is in use`                                                        | Another `npm run dev` is still running. Close that terminal, or open the address Next.js prints instead.           |
| A command works in PowerShell but not in Git Bash (or the other way)         | Environment variables are set differently: `export NAME='value'` in Git Bash, `$env:NAME = "value"` in PowerShell. |

If you are stuck for more than twenty minutes, ask Juan.
