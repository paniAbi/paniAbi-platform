// The build Vercel runs for every deploy (set in vercel.json).
// On Vercel production and preview it first applies pending migrations to
// that environment's own Neon branch, then builds the app.
// On your computer it only builds: it never migrates.
// Usage: node scripts/vercel-build.mjs
import { spawnSync } from "node:child_process";
import process from "node:process";
import { stop } from "./lib/git.mjs";
import { shouldMigrate } from "./lib/helpers.mjs";

// Runs a fixed command line and stops the script if it fails.
// Fixed command lines with no user input, so using the shell is safe.
// The shell is needed on Windows, where npm and npx are .cmd files.
function runStep(name, command) {
  console.log(`\n=== ${name}: ${command}`);
  const result = spawnSync(command, { shell: true, stdio: "inherit" });
  if (result.status !== 0) {
    stop(`ERROR: "${name}" failed, so the deploy was stopped.`);
  }
}

const vercelEnv = process.env.VERCEL_ENV;

if (shouldMigrate(vercelEnv)) {
  // Only adds what is missing. Rule: migrations only add tables or columns;
  // deleting or renaming goes in a second pull request.
  runStep(`Database migrations (${vercelEnv})`, "npx prisma migrate deploy");
} else {
  console.log("Not a Vercel production or preview build: skipping migrations.");
}

runStep("Build", "npm run build");
