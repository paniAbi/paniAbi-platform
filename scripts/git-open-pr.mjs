// Push your branch and open its pull request, or update it if it already exists.
// Usage: node scripts/git-open-pr.mjs [--body-file <file>] ["optional title"]
import { existsSync, readdirSync } from "node:fs";
import process from "node:process";
import {
  BASE_BRANCH,
  currentBranch,
  git,
  insideRepository,
  run,
  stop,
  uncommittedChanges,
} from "./lib/git.mjs";
import {
  findPlanFile,
  parseBranch,
  parseOpenPrArguments,
  prTitle,
  repoPathFromRemote,
} from "./lib/helpers.mjs";

const PLANS_FOLDER = "docs/plans";
const TEMPLATE = ".github/pull_request_template.md";

if (!insideRepository()) {
  stop("ERROR: you are not inside the project folder.");
}

const branch = currentBranch();
if (branch === BASE_BRANCH) {
  stop(
    `STOP: you are on '${BASE_BRANCH}'. A pull request must come from your own branch.`,
    "Start a ticket first:  node scripts/ticket-start.mjs <number> <description>",
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

let options;
try {
  options = parseOpenPrArguments(process.argv.slice(2));
} catch (error) {
  stop(`ERROR: ${error.message}`);
}

const parsed = parseBranch(branch);
if (!parsed) {
  stop(
    `STOP: '${branch}' is not a ticket branch (expected feat/<number>-<description>).`,
    "Start a ticket first:  node scripts/ticket-start.mjs <number> <description>",
  );
}

const planFiles = existsSync(PLANS_FOLDER) ? readdirSync(PLANS_FOLDER) : [];
if (!findPlanFile(parsed.ticket, planFiles)) {
  stop(
    `STOP: there is no plan for ticket ${parsed.ticket}.`,
    `Expected a file like ${PLANS_FOLDER}/${parsed.ticket}-<description>.md`,
    "Write the plan and get it approved before opening a pull request.",
  );
}

const bodyFile = options.bodyFile ?? TEMPLATE;
if (!existsSync(bodyFile)) {
  stop(`ERROR: the file '${bodyFile}' does not exist.`);
}
const title = prTitle(branch, options.title);

console.log("Pushing your branch...");
if (!git(["push", "-u", "origin", branch]).ok) {
  stop(
    "ERROR: could not push your branch to GitHub.",
    "If GitHub says your branch is behind, run:  node scripts/git-sync.mjs",
    "Then try again.",
  );
}

if (run("gh", ["auth", "status"], { capture: true }).ok) {
  const existing = run(
    "gh",
    [
      "pr",
      "view",
      branch,
      "--json",
      "url,state",
      "--jq",
      'select(.state == "OPEN") | .url',
    ],
    { capture: true },
  );
  if (existing.ok && existing.stdout) {
    console.log(
      [
        "The pull request already exists and now has your new commits:",
        `    ${existing.stdout}`,
      ].join("\n"),
    );
    process.exit(0);
  }

  console.log("Creating the pull request...");
  const created = run("gh", [
    "pr",
    "create",
    "--base",
    BASE_BRANCH,
    "--head",
    branch,
    "--title",
    title,
    "--body-file",
    bodyFile,
  ]);
  if (!created.ok) {
    stop("ERROR: GitHub did not accept the pull request. Ask Juan for help.");
  }
  console.log("Done. Ask Juan for a review.");
  process.exit(0);
}

const remote = git(["remote", "get-url", "origin"], { capture: true }).stdout;
const repoPath = repoPathFromRemote(remote);
console.log(
  [
    "",
    "Your branch is on GitHub, but the 'gh' command is not available here.",
    repoPath
      ? "Open the pull request in your browser with this link:"
      : "Open the repository on GitHub and create the pull request from branch:",
    "",
    repoPath
      ? `    https://github.com/${repoPath}/compare/${BASE_BRANCH}...${branch}?expand=1`
      : `    ${branch}`,
    "",
    `Title:        ${title}`,
    `Description:  copy the contents of ${bodyFile}`,
  ].join("\n"),
);
