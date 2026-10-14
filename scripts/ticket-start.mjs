// Start working on a ticket: creates your branch from an up-to-date main.
// Usage:   node scripts/ticket-start.mjs <ticket-number> <short description>
// Example: node scripts/ticket-start.mjs 42 product list page
import process from "node:process";
import {
  BASE_BRANCH,
  git,
  goToRepositoryRoot,
  stop,
  stopIfUnfinishedOperation,
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

goToRepositoryRoot();
stopIfUnfinishedOperation();

const changes = uncommittedChanges();
if (changes) {
  stop(
    "STOP: you have changes that are not saved in a commit yet.",
    "",
    changes,
    "",
    "Commit or discard them before starting a new ticket.",
    "",
    "To save them in a commit:",
    "    git add .",
    '    git commit -m "your message"',
  );
}

if (git(["show-ref", "--verify", "--quiet", `refs/heads/${branch}`]).ok) {
  console.log(`That branch already exists. Switching to it: ${branch}`);
  if (!git(["switch", branch]).ok)
    stop(`ERROR: could not switch to ${branch}.`);
  process.exit(0);
}

console.log("Fetching the latest changes...");
if (!git(["fetch", "origin", "--prune"]).ok) {
  stop("ERROR: could not reach GitHub. Check your connection and try again.");
}

// The branch may already be on GitHub (started on another computer or by a
// teammate). Use that one instead of creating a new branch with the same name.
if (
  git(["show-ref", "--verify", "--quiet", `refs/remotes/origin/${branch}`]).ok
) {
  console.log(
    `That branch already exists on GitHub. Switching to it: ${branch}`,
  );
  if (!git(["switch", "--track", `origin/${branch}`]).ok) {
    stop(`ERROR: could not switch to ${branch}.`);
  }
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
