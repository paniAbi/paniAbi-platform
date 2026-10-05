// Small wrappers around Git and other programs, shared by the scripts.
import { spawnSync } from "node:child_process";
import process from "node:process";

export const BASE_BRANCH = "main";

// Runs a program without a shell, so arguments are passed exactly as given.
// ok is false when the program fails or is not installed.
export function run(program, args, { capture = false } = {}) {
  const result = spawnSync(program, args, {
    encoding: "utf8",
    stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
  });
  return {
    ok: !result.error && result.status === 0,
    stdout: (result.stdout ?? "").trim(),
  };
}

export function git(args, options) {
  return run("git", args, options);
}

export function insideRepository() {
  return git(["rev-parse", "--is-inside-work-tree"], { capture: true }).ok;
}

export function currentBranch() {
  return git(["rev-parse", "--abbrev-ref", "HEAD"], { capture: true }).stdout;
}

export function uncommittedChanges() {
  return git(["status", "--short"], { capture: true }).stdout;
}

export function isMerging() {
  return git(["rev-parse", "-q", "--verify", "MERGE_HEAD"], { capture: true })
    .ok;
}

export function stop(...lines) {
  console.error(lines.join("\n"));
  process.exit(1);
}
