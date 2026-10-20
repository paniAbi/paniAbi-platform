# paniAbi Platform

A product and operations workspace for the paniAbi bakery team.

- **Live site:** https://pani-abi-platform.vercel.app/products
- **Team workflow:** [CONTRIBUTING.md](CONTRIBUTING.md)
- **Rules for coding agents (Codex, Claude Code):** [AGENTS.md](AGENTS.md)

## Stack

Next.js App Router, TypeScript, React, Tailwind CSS, shadcn/ui, Prisma,
PostgreSQL (Neon online, Docker on your computer), Zod, React Hook Form, Vitest, ESLint and Prettier.

## 1. Install the tools (once per computer)

You need five programs. After installing each one, run its check command in
a new terminal; it must print a version (or "Logged in") without errors.

| Tool                  | Windows                                            | macOS                                                                       | Check               |
| --------------------- | -------------------------------------------------- | --------------------------------------------------------------------------- | ------------------- |
| Git                   | `winget install --id Git.Git -e`                   | `xcode-select --install`                                                    | `git --version`     |
| nvm (Node versions)   | `winget install --id CoreyButler.NVMforWindows -e` | [nvm install script](https://github.com/nvm-sh/nvm#installing-and-updating) | `nvm --version`     |
| Node 22 (through nvm) | `nvm install 22` then `nvm use 22`                 | `nvm install` then `nvm use` (reads `.nvmrc`)                               | `node -v` → `v22.x` |
| GitHub CLI            | `winget install --id GitHub.cli -e`                | `brew install gh`                                                           | `gh auth status`    |
| Docker Desktop        | `winget install --id Docker.DockerDesktop -e`      | `brew install --cask docker`                                                | `docker info`       |

Then sign in to GitHub once with `gh auth login` (choose GitHub.com, HTTPS,
and "Login with a web browser").

Open Docker Desktop once after installing it and accept its terms. It must be
running whenever you work on the app, because your local database lives in
it.

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

   It already points at your local database: you do not need any URL from
   Juan.

4. With Docker Desktop open, create your local database with the tables and
   sample products:

   ```bash
   npm run db:local
   ```

   Run it again whenever the database is stopped (for example after
   restarting the computer). It never erases data.

5. Start the app and open http://localhost:3000/products:

   ```bash
   npm run dev
   ```

   Stop it with `Ctrl+C`.

### Already had the app running before the local database?

Until October 2026 everyone's `.env` pointed at the live site's database.
If you set up the app before then, move to your own local database once:

1. Install Docker Desktop if you do not have it (section 1), open it, and
   wait until it says **Engine running**.
2. Get the latest version of the project:

   ```bash
   git switch main
   npm run git:sync
   ```

3. Replace your `.env` with the example. **Run this yourself** (your coding
   agent will not edit `.env`). It removes the old live-site URLs; you do
   not need them anymore.

   ```bash
   cp .env.example .env
   ```

4. Create your local database with the tables and sample products:

   ```bash
   npm run db:local
   ```

5. Start the app and open http://localhost:3000/products:

   ```bash
   npm run dev
   ```

   You see the sample products. From now on, nothing you create on your
   computer reaches the live site.

## 3. Day-to-day commands

| What you want to do                         | Command                                        |
| ------------------------------------------- | ---------------------------------------------- |
| Start a ticket (creates your branch)        | `npm run ticket:start -- 42 product list page` |
| Bring the latest `main` into your branch    | `npm run git:sync`                             |
| Start the local database                    | `npm run db:local`                             |
| Run the app                                 | `npm run dev`                                  |
| Run every check CI runs (do it before a PR) | `npm run check`                                |
| Push your branch and open the pull request  | `npm run git:pr`                               |

The full flow (plan, approval, review) is in [CONTRIBUTING.md](CONTRIBUTING.md).

## 4. Databases

Each database has one job:

| Database          | Used by                                   |
| ----------------- | ----------------------------------------- |
| Local (Docker)    | Everyone's computer (`npm run db:local`). |
| Neon `production` | The live site.                            |
| Neon `dev`        | Pull request previews.                    |
| Neon `ci`         | GitHub Actions.                           |

When you run the app on your computer you use **your own local database**:

- Nothing you create while testing reaches the live site. Still use only
  invented data.
- **Only Juan changes the database structure.** Do not edit
  `prisma/schema.prisma`, `prisma/migrations/` or `prisma/seed.ts`, and do
  not run `npm run db:migrate`, `npm run db:seed` or any `prisma migrate` /
  `prisma db push` command. `npm run db:local` is the one database command
  for everyone. If your feature needs a new field or table, stop and ask
  Juan; he adds it first in his own pull request.

### Database changes (Juan only)

1. Keep your `.env` on the local database.
2. Change `prisma/schema.prisma` and run `npm run db:migrate`: it creates the
   migration file and applies it to your local database.
3. Open a pull request. Its preview migrates `dev`; the merge migrates
   `production` (`scripts/vercel-build.mjs`).

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
| `The table ... does not exist`                                               | Run `npm run db:local`. If it still happens, ask Juan.                                                             |
| `STOP: Docker is not running`                                                | Open Docker Desktop, wait until it says it is running, and run `npm run db:local` again.                           |
| `Can't reach database server at localhost:5432`                              | Your local database is stopped. Open Docker Desktop and run `npm run db:local`.                                    |
| `STOP: DATABASE_URL in .env does not point at this computer`                 | Your `.env` still has Neon URLs. Replace it with the example: `cp .env.example .env`.                              |
| `port is already allocated` or `address already in use` for port 5432        | Another PostgreSQL is running on your computer. Stop it (macOS: `brew services stop postgresql`) or ask Juan.      |
| You want to start again with only the sample products                        | `docker compose down -v` erases only your local database. Then run `npm run db:local`.                             |
| `Port 3000 is in use`                                                        | Another `npm run dev` is still running. Close that terminal, or open the address Next.js prints instead.           |
| A command works in PowerShell but not in Git Bash (or the other way)         | Environment variables are set differently: `export NAME='value'` in Git Bash, `$env:NAME = "value"` in PowerShell. |

If you are stuck for more than twenty minutes, ask Juan.
