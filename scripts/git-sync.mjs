// Bring the latest changes from main into your current branch.
// Run this before you start working, and again if your PR shows conflicts.
// Usage: node scripts/git-sync.mjs
import process from "node:process";
import {
  BASE_BRANCH,
  currentBranch,
  git,
  insideRepository,
  isMerging,
  stop,
  uncommittedChanges,
} from "./lib/git.mjs";

if (!insideRepository()) {
  stop(
    "ERROR: you are not inside the project folder.",
    "Open a terminal inside the repository and try again.",
  );
}

if (isMerging()) {
  stop(
    "STOP: a previous merge is not finished yet.",
    "Fix the conflicts and commit, or undo it with:  git merge --abort",
  );
}

const changes = uncommittedChanges();
if (changes) {
  stop(
    "STOP: you have changes that are not saved in a commit yet.",
    "",
    changes,
    "",
    "Commit them first, then run this script again.",
    "",
    "To save them in a commit:",
    "    git add .",
    '    git commit -m "your message"',
  );
}

const branch = currentBranch();
console.log("Fetching the latest changes...");
if (!git(["fetch", "origin", "--prune"]).ok) {
  stop("ERROR: could not reach GitHub. Check your connection and try again.");
}

if (branch === BASE_BRANCH) {
  if (!git(["pull", "--ff-only", "origin", BASE_BRANCH]).ok) {
    stop(
      `ERROR: your local ${BASE_BRANCH} could not be updated.`,
      "Ask Juan before doing anything else.",
    );
  }
  console.log(`Done. Your ${BASE_BRANCH} is up to date.`);
  process.exit(0);
}

console.log(`Bringing '${BASE_BRANCH}' into your branch '${branch}'...`);
if (git(["merge", "--no-edit", `origin/${BASE_BRANCH}`]).ok) {
  console.log(`Done. Your branch now includes everything from ${BASE_BRANCH}.`);
  process.exit(0);
}

const conflicted = git(["diff", "--name-only", "--diff-filter=U"], {
  capture: true,
}).stdout;

if (!conflicted) {
  stop("ERROR: the merge failed. Ask Juan before doing anything else.");
}

stop(
  "",
  "There is a conflict: the same lines were changed in two places.",
  "Git needs you to choose which version stays.",
  "",
  "Files to fix:",
  ...conflicted.split("\n").map((file) => `    ${file}`),
  "",
  "Open each file, keep the correct version, remove the <<<<<<< ======= >>>>>>> markers, then run:",
  "    git add <file>",
  "    git commit --no-edit",
  "",
  "To undo the merge and go back to how things were:",
  "    git merge --abort",
  "",
  "If you get stuck, ask Juan before doing anything else.",
);
