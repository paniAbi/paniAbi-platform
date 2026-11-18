// Create a migration from prisma/schema.prisma and apply it to the local
// Docker database. It refuses to run unless .env points at this computer,
// so `prisma migrate dev` (which can offer to reset the database) never
// reaches a Neon database.
// Usage: npm run db:migrate -- --name <short-description>
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import process from "node:process";
import { goToRepositoryRoot, stop } from "./lib/git.mjs";
import { localDatabaseProblem, migrateDevArguments } from "./lib/helpers.mjs";

goToRepositoryRoot();

const envFileExists = existsSync(".env");
if (envFileExists) process.loadEnvFile(".env");
// process.env, not only the file: a variable exported in the terminal wins
// over .env for Prisma too, so that is the database it would change.
const problem = localDatabaseProblem({ envFileExists, env: process.env });
if (problem) stop(...problem);

const result = spawnSync(
  process.execPath,
  migrateDevArguments(process.argv.slice(2)),
  { stdio: "inherit" },
);
process.exit(result.status ?? 1);
