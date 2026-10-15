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

   Ask Juan for **your own** Neon branch and paste its two URLs in `.env`:
   `DATABASE_URL` (pooled, the host contains `-pooler`) and `DIRECT_URL`
   (direct, without `-pooler`). To copy a URL from Neon: open the branch,
   click **Connect**, then **Copy snippet**. Paste only the text that starts
   with `postgresql://`, inside the quotes that are already in `.env`.

4. Create the tables in your database and add the sample products:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. Start the app and open http://localhost:3000/products:

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
| Apply new migrations to your database       | `npm run db:migrate`                           |

The full flow (plan, approval, review) is in [CONTRIBUTING.md](CONTRIBUTING.md).

## 4. Databases

Each Neon branch has one name and one job:

| Neon branch    | Used by                                                   |
| -------------- | --------------------------------------------------------- |
| `production`   | The live site.                                            |
| `preview`      | Every pull request preview (shared by all pull requests). |
| `ci`           | GitHub Actions.                                           |
| one per person | Your own computer. Only you migrate it.                   |

Never put the `production` or `preview` URLs in your `.env`.

**Migrations only add.** Adding tables or columns is safe. Deleting or
renaming something goes in a second pull request, once no code uses the old
name, because the live site keeps running the old code while the new version
builds.

## 5. Live site and previews

- Every merge into `main` publishes the live site automatically:
  https://pani-abi-platform.vercel.app
- Every pull request gets its own preview link. Vercel posts it as a comment
  on the pull request. Previews use the `preview` database, so they never
  change the live data.
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
| `the URL must start with the protocol postgresql://`                         | The URL in `.env` has extra text. Keep only `postgresql://...`, copied with **Copy snippet**.                      |
| `Cannot find module '.prisma/client'` or `@prisma/client did not initialize` | Run `npx prisma generate`.                                                                                         |
| `The table public.Product does not exist`                                    | Your database has no tables yet. Run `npm run db:migrate`.                                                         |
| `Port 3000 is in use`                                                        | Another `npm run dev` is still running. Close that terminal, or open the address Next.js prints instead.           |
| A command works in PowerShell but not in Git Bash (or the other way)         | Environment variables are set differently: `export NAME='value'` in Git Bash, `$env:NAME = "value"` in PowerShell. |

If you are stuck for more than twenty minutes, ask Juan.
