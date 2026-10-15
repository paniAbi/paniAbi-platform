---
name: check-work
description: Use when the person asks whether everything is fine, before opening a review request, or when a check failed on GitHub. Do not use to answer review comments (use address-review).
---

# Check work

## Purpose

Run the same checks CI runs (Prisma client, lint, type check, tests and
build) and explain any failure in plain language.

## Steps

1. Run:

   ```
   node scripts/check.mjs
   ```

   It runs every check and ends with a `PASS`/`FAIL` summary.

2. Everything `PASS`: tell them it is all fine and suggest the next step
   (open-pr if the plan is fully built).
3. For each `FAIL`, read its output and explain in one or two sentences what
   kind of problem it is:
   - Prisma client: "the tools that talk to the database could not be
     prepared". Use ask-for-help (Juan).
   - Lint: "the code doesn't follow the team's writing rules".
   - Type check: "two parts of the code don't fit together".
   - Tests: "an automatic check says <behaviour> does not work as expected".
   - Build: "the app cannot be put together for publishing".
4. If the failure is in a file this branch changed
   (`git diff main...HEAD --name-only`): propose the fix, wait for "ok", fix
   it, commit with `fix: <what> (#<n>)`, and run the checks again.
5. If it is in a file this branch did not change, or you cannot find the
   cause after two attempts: use ask-for-help (Juan).

## Never

- Disable a lint rule, skip a test, or change a test just so it passes.
- Change CI or configuration files to make a check pass.

## Done when

Every check passes, or the problem is with Juan through ask-for-help.
