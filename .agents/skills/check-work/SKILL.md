---
name: check-work
description: Use when the person asks whether everything is fine, before opening a review request, or when a check failed on GitHub. Do not use to answer review comments (use address-review).
---

# Check work

## Purpose

Run the same checks CI runs (Prisma client, lint, type check, tests and
build) and explain any failure in plain language.

## Steps

1. If they come because a check failed on GitHub (an email, or the review
   request shows a red cross), look there first:

   ```
   gh pr checks
   gh run view --log-failed
   ```

   Then run the checks on their computer (step 2) and compare. If it fails on
   GitHub but passes on their computer, the problem is in how GitHub runs the
   checks, not in their work: use ask-for-help (Juan) with the error from
   GitHub, and do not tell them everything is fine.

2. Run:

   ```
   node scripts/check.mjs
   ```

   It runs every check and ends with a `PASS`/`FAIL` summary.

3. Everything `PASS` (and nothing failed on GitHub): tell them it is all
   fine and suggest the next step (open-pr if the plan is fully built).
4. For each `FAIL`, read its output and explain in one or two sentences what
   kind of problem it is:
   - Prisma client: "the tools that talk to the database could not be
     prepared". Use ask-for-help (Juan).
   - Lint: "the code doesn't follow the team's writing rules".
   - Type check: "two parts of the code don't fit together".
   - Tests: "an automatic check says <behaviour> does not work as expected".
   - Build: "the app cannot be put together for publishing".
5. Decide whether this branch caused the failure. Look at
   `git diff main...HEAD --name-only` and at what the plan changed.
   - Caused by this branch: an error in a file it changed, or an older test
     that still expects the behaviour the plan deliberately changed (for
     example it expects "1500.00" and the plan added the "$"). Check that the
     only difference is the planned change; anything else may be a real
     mistake. Propose the
     fix, wait for "ok", fix it, then save and push it:
     `git commit -m "fix: <what> (#<n>)"` and `git push`. If you updated an
     older test, say so in the review request. Run the checks again.
   - Not caused by this branch (for example it came from `main` with the
     latest changes), or you cannot find the cause after two attempts: use
     ask-for-help (Juan), even when the fix looks like one line. When
     Juan's fix is on `main`, use sync-branch and run the checks again.

## Never

- Disable a lint rule or skip a test.
- Change what a test expects, unless the plan changed that behaviour.
- Edit a file to fix a failure this branch did not cause.
- Change CI or configuration files to make a check pass.
- Open the review request while a check fails, here or on GitHub.

## Done when

Every check passes, or the problem is with Juan through ask-for-help.
