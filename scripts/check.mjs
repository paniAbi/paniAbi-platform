// Run the four checks that CI runs, then show a summary.
// All checks run even if one fails, so you see every problem at once.
// Usage: node scripts/check.mjs
import { spawnSync } from "node:child_process";
import process from "node:process";

const CHECKS = [
  { name: "Lint", command: "npm run lint" },
  { name: "Type check", command: "npx tsc --noEmit" },
  { name: "Tests", command: "npx vitest run" },
  { name: "Build", command: "npm run build" },
];

const results = CHECKS.map((check) => {
  console.log(`\n=== ${check.name}: ${check.command}`);
  // Fixed command lines with no user input, so using the shell is safe.
  // The shell is needed on Windows, where npm and npx are .cmd files.
  const result = spawnSync(check.command, { shell: true, stdio: "inherit" });
  return { name: check.name, passed: result.status === 0 };
});

console.log("\nSummary:");
for (const result of results) {
  console.log(`  ${result.passed ? "PASS" : "FAIL"}  ${result.name}`);
}

if (results.some((result) => !result.passed)) {
  process.exit(1);
}
console.log("\nAll checks passed.");
