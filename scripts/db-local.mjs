// Start the local Docker database and fill it with the tables and sample
// products. Safe to run again: it never erases data.
// It refuses to run unless .env points at this computer, so it can never
// change a Neon database.
// Usage: npm run db:local
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import process from "node:process";
import { goToRepositoryRoot, run, stop } from "./lib/git.mjs";
import { localDatabaseProblem } from "./lib/helpers.mjs";

// Runs a fixed command line and stops the script if it fails.
// Fixed command lines with no user input, so using the shell is safe.
// The shell is needed on Windows, where npm and npx are .cmd files.
function runStep(name, command) {
  console.log(`\n=== ${name}: ${command}`);
  const result = spawnSync(command, { shell: true, stdio: "inherit" });
  if (result.status !== 0) {
    stop(
      `ERROR: "${name}" failed.`,
      "Fix the problem above and run it again: it is safe to repeat.",
    );
  }
}

goToRepositoryRoot();

const envFileExists = existsSync(".env");
if (envFileExists) process.loadEnvFile(".env");
const problem = localDatabaseProblem({ envFileExists, env: process.env });
if (problem) stop(...problem);

if (!run("docker", ["info"], { capture: true }).ok) {
  stop(
    "STOP: Docker is not running.",
    "Open Docker Desktop, wait until it says it is running, then try again.",
  );
}

runStep("Start the database", "docker compose up -d --wait");
// Only adds what is missing: it never resets the database.
runStep("Create the tables", "npx prisma migrate deploy");
// A fresh npm ci does not generate the client that the seed needs.
runStep("Prepare the database client", "npx prisma generate");
runStep("Add the sample products", "npx prisma db seed");

console.log("\nThe local database is ready. Start the app with: npm run dev");
