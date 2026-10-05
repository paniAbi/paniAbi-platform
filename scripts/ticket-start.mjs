// Start working on a ticket: creates your branch from an up-to-date main.
// Usage:   node scripts/ticket-start.mjs <ticket-number> <short description>
// Example: node scripts/ticket-start.mjs 42 product list page
import process from "node:process";
import {
  BASE_BRANCH,
  git,
  insideRepository,
  isMerging,
  stop,
  uncommittedChanges,
} from "./lib/git.mjs";
import { branchName } from "./lib/helpers.mjs";

const [ticket, ...words] = process.argv.slice(2);
if (!ticket || words.length === 0) {
  stop(
    "Usage:   node scripts/ticket-start.mjs <ticket-number> <short description>",
    "Example: node scripts/ticket-start.mjs 42 product list page",
  );
}

let branch;
try {
  branch = branchName(ticket, words.join(" "));
} catch (error) {
  stop(`ERROR: ${error.message}`);
}

if (!insideRepository()) {
  stop("ERROR: you are not inside the project folder.");
}

if (isMerging()) {
  stop(
    "STOP: a merge is not finished yet.",
    "Finish it, or undo it with:  git merge --abort",
  );
}

const changes = uncommittedChanges();
if (changes) {
  stop(
    "STOP: you have changes that are not saved in a commit yet.",
    "",
    changes,
    "",
    "Commit or discard them before starting a new ticket.",
  );
}

if (git(["show-ref", "--verify", "--quiet", `refs/heads/${branch}`]).ok) {
  console.log(`That branch already exists. Switching to it: ${branch}`);
  if (!git(["switch", branch]).ok)
    stop(`ERROR: could not switch to ${branch}.`);
  process.exit(0);
}

console.log(`Updating ${BASE_BRANCH}...`);
if (!git(["switch", BASE_BRANCH]).ok) {
  stop(`ERROR: could not switch to ${BASE_BRANCH}.`);
}
if (!git(["pull", "--ff-only", "origin", BASE_BRANCH]).ok) {
  stop(
    `ERROR: your local ${BASE_BRANCH} could not be updated.`,
    "Ask Juan before doing anything else.",
  );
}

console.log(`Creating branch: ${branch}`);
if (!git(["switch", "-c", branch]).ok) {
  stop(`ERROR: could not create ${branch}.`);
}
if (!git(["push", "-u", "origin", branch]).ok) {
  stop(
    "ERROR: the branch was created on your computer but could not be pushed to GitHub.",
    "Check that you have access to the repository, then run:",
    `    git push -u origin ${branch}`,
  );
}

console.log(
  [
    "",
    `Ready. You are now on '${branch}'.`,
    "Write your plan, get it approved, and then start working.",
  ].join("\n"),
);
