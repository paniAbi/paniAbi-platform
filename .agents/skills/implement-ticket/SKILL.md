---
name: implement-ticket
description: Use when the person wants to start or continue building their card after Mauricio approved the plan, for example "let's start building". Do not use while the plan is waiting for approval or needs changes (use plan-ticket).
---

# Implement ticket

## Purpose

Build the approved plan one step at a time, explaining each step and saving
it as its own commit.

## Before you start

All four approval checks must pass:

1. The current branch is `feat/<n>-<description>`; `n` is the card number.
2. Card `n` is in `Approved Plan`, or in `In Progress` when resuming.
3. In the card's activity (Trello connector), the most recent move into
   `Approved Plan` was made by `mauriciocuello3`. Note the time of that move.
4. The last commit that touched the plan,
   `git log -1 --format=%cI -- docs/plans/<n>-*.md`, is older than that move
   (compare both in UTC).

If any check fails, stop and explain it in product terms, for example
"Mauricio has not approved the plan yet" or "The plan changed after Mauricio
approved it, so it needs another look". Point to plan-ticket or next-step.
Never continue "just this once".

Also: `git status --short` must be empty. If it is not, ask what those changes
are before going on.

## Steps

1. Move the card to `In Progress` if it is not there yet.
2. Read part 2 of the plan and `docs/code-patterns.md`.
3. Find where you are: `git log main..HEAD --oneline`. Steps already done have
   commits ending in `(step k/N, #n)`.
4. For each remaining step `k` of `N`:
   1. Say in one or two sentences what this step changes for Abril. Wait for
      "ok".
   2. Read the Next.js 16 guide under `node_modules/next/dist/docs/` for what
      this step uses.
   3. Write the test first. Run `npx vitest run <test file>` and confirm it
      fails for the expected reason. Tell them: "I wrote an automatic check
      that describes how it should work. It fails because we haven't built it
      yet."
   4. Make the smallest change that makes the test pass, following
      `docs/code-patterns.md`.
   5. Run `npx vitest run`. Every test must pass.
   6. If the step changes something Abril can see, tell them how to look:
      run `npm run dev` and open the exact address (for example
      `http://localhost:3000/products`). Anything they create there appears on
      the live site: only invented data, and test products are named
      `TEST - ...`.
   7. Save the step:

      ```
      git add <the files of this step>
      git commit -m "feat: <what changed> (step k/N, #n)"
      ```

      Use `test:`, `fix:` or `chore:` instead of `feat:` when it fits. Tell
      them: "I saved this step."

5. Database changes are never part of this skill. If a step needs a new
   field, table or sample data that is not on `main` yet, stop: it is a plan
   change (see below), and Juan adds it first.
6. When every step is saved, use check-work, then suggest open-pr.

## What to tell the person

- Progress: "Step 2 of 4: now Abril will be able to …"
- End: "All the steps of the plan are built. Let's run the automatic checks
  before sending it to Juan."

## When something goes wrong

| Situation                                                     | What to do                                                                                                                            |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| A step cannot be done as the plan says, or a new need appears | Stop and explain what is different. Use plan-ticket to update the plan; the card goes back to `Planning` and Mauricio approves again. |
| A new library seems necessary                                 | That is a plan change (row above).                                                                                                    |
| The database needs a change                                   | That is a plan change, and Juan makes it first. Use ask-for-help (Juan).                                                              |
| A test fails and you do not know why after two attempts       | Stop and use ask-for-help.                                                                                                            |
| `.env` is missing or the database does not answer             | Use ask-for-help (Juan). Never write credentials yourself.                                                                            |

## Never

- Write code that is not in the plan.
- Skip the test, or commit several steps together.
- Touch `.env` or anything in `prisma/`, run `prisma migrate` or
  `npm run db:*`, or add or upgrade dependencies that the plan does not list.

## Done when

Every plan step has its commit, all tests pass, the card is in `In Progress`,
and the next step is check-work, then open-pr.
