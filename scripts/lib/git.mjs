// Small wrappers around Git and other programs, shared by the scripts.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import process from "node:process";

export const BASE_BRANCH = "main";

// Runs a program without a shell, so arguments are passed exactly as given.
// ok is false when the program fails or is not installed.
// capture: keep the output in stdout instead of printing it.
// showErrors: with capture, still print error messages on the screen.
export function run(
  program,
  args,
  { capture = false, showErrors = false } = {},
) {
  const result = spawnSync(program, args, {
    encoding: "utf8",
    stdio: capture
      ? ["ignore", "pipe", showErrors ? "inherit" : "pipe"]
      : "inherit",
  });
  return {
    ok: !result.error && result.status === 0,
    stdout: (result.stdout ?? "").trim(),
  };
}

export function git(args, options) {
  return run("git", args, options);
}

// Moves to the top folder of the repository, so paths like "docs/plans" work
// even when the script is run from a subfolder such as "src/".
// Stops the script when we are not inside the repository.
export function goToRepositoryRoot() {
  const root = git(["rev-parse", "--show-toplevel"], { capture: true });
  if (!root.ok || !root.stdout) {
    stop(
      "ERROR: you are not inside the project folder.",
      "Open a terminal inside the repository and try again.",
    );
  }
  process.chdir(root.stdout);
}

// Returns the branch name. Stops the script when Git is not on any branch
// ("detached HEAD"), because new commits there are easy to lose.
export function currentBranch() {
  const branch = git(["rev-parse", "--abbrev-ref", "HEAD"], {
    capture: true,
  }).stdout;
  if (branch === "HEAD") {
    stop(
      "STOP: you are not on any branch (Git calls this 'detached HEAD').",
      "Go back to your ticket branch with:  git switch <your-branch>",
      "If you are not sure which branch, ask Juan.",
    );
  }
  return branch;
}

export function uncommittedChanges() {
  return git(["status", "--short"], { capture: true }).stdout;
}

// Returns the name of a Git operation that was started but not finished
// ("merge", "rebase" or "cherry-pick"), or null when there is none.
export function unfinishedOperation() {
  const refExists = (ref) =>
    git(["rev-parse", "-q", "--verify", ref], { capture: true }).ok;
  const gitPathExists = (name) =>
    existsSync(
      git(["rev-parse", "--git-path", name], { capture: true }).stdout,
    );

  if (refExists("MERGE_HEAD")) return "merge";
  if (gitPathExists("rebase-merge") || gitPathExists("rebase-apply")) {
    return "rebase";
  }
  if (refExists("CHERRY_PICK_HEAD")) return "cherry-pick";
  return null;
}

// Stops the script when a merge, rebase or cherry-pick is half done.
export function stopIfUnfinishedOperation() {
  const operation = unfinishedOperation();
  if (operation) {
    stop(
      `STOP: a previous ${operation} is not finished yet.`,
      "Fix the conflicts and continue it, or undo it with:",
      `    git ${operation} --abort`,
    );
  }
}

export function stop(...lines) {
  console.error(lines.join("\n"));
  process.exit(1);
}
