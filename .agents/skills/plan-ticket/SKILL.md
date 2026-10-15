---
name: plan-ticket
description: Use when the person wants to write the plan for their current card, or to revise it after Mauricio's comments. Do not use to write application code (use implement-ticket) or to approve a plan.
---

# Plan ticket

## Purpose

Write `docs/plans/<n>-<description>.md` from the template, with the person
confirming the product part, and hand it to Mauricio for approval.

## Before you start

1. The current branch is `feat/<n>-<description>` (`git branch --show-current`).
   On `main`, use start-ticket.
2. Read card `n` with the Trello connector. It must be in `Planning`. If it is
   in `Approved Plan` or `In Progress` and they want to change the plan, warn
   them that Mauricio will have to approve it again. If they agree, move the
   card back to `Planning`.
3. `git status --short` shows nothing, or only the plan file.

## Steps

1. Gather context: the card's description, checklists and comments. When
   revising, also read the current plan and Mauricio's comments (Trello user
   `mauriciocuello3`) newer than the last plan commit
   (`git log -1 --format=%cI -- docs/plans/`).
2. Read `docs/code-patterns.md`, the code the card touches, and the relevant
   Next.js 16 guide under `node_modules/next/dist/docs/`.
3. New plan only: copy `docs/plans/_template.md` to
   `docs/plans/<n>-<description>.md`, where `<n>-<description>` is the branch
   name without `feat/`.
4. Write part 1, "What changes for Abril". Explain it to the person in their
   language (the file stays in English). Ask whether it matches what Abril
   asked. Anything nobody knows goes into "Open questions for Abril". Never
   fill a gap by guessing.
5. If "Open questions for Abril" is not empty: help them phrase the questions
   for Abril, save the draft (step 8) so it is not lost, and stop here. Do not
   ask for approval. Continue when they come back with answers.
6. Write part 2, "How we will build it": files following
   `docs/code-patterns.md`; whether the database changes; numbered steps where
   each step is one small commit and starts with a test; risks for the
   reviewer. Each step must be explainable in one sentence of product
   language.
   If the card needs a new field, table or sample data in the database: only
   Juan changes the database. Save the draft (step 8), use ask-for-help so
   Juan adds it first in his own pull request, and stop. Continue when his
   pull request is merged; link it under "Database change".
7. Explain part 2 in product terms: how many steps and what each one lets
   Abril do. No code.
8. Save and share:

   ```
   git add docs/plans/<n>-<description>.md
   git commit -m "docs: add plan for #<n>"
   git push
   ```

   When revising, use `docs: update plan for #<n>`. If the plan had been
   approved before, add a dated line under "Changes after approval" saying
   what changed and why.

9. Draft a card comment in the person's language:
   "Plan ready for review @mauriciocuello3:
   https://github.com/<owner>/<repo>/blob/<branch>/docs/plans/<file>".
   Take `<owner>/<repo>` from `git remote get-url origin`. Show it to the
   person and post it with the Trello connector after their "ok".
10. Tell them the plan is waiting for Mauricio, and that nothing else happens
    on this card until Mauricio moves it to `Approved Plan` or comments.

## What to tell the person

- Start: "First let's agree on what will change for Abril. Then we'll decide
  how to build it."
- Part 2: "We'll do it in three steps: first …, then …, and finally …"
- End: "Mauricio has the plan. When it is approved, tell me 'let's start
  building'."

## When something goes wrong

| Situation                                      | What to do                                                              |
| ---------------------------------------------- | ----------------------------------------------------------------------- |
| The card asks for something nobody understands | Write it as an open question for Abril.                                 |
| The card needs a database change               | Use ask-for-help (Juan) and wait for his pull request (step 6).         |
| The plan needs more than about six steps       | Suggest splitting the card; use ask-for-help to propose it to Mauricio. |
| `git push` is rejected                         | Use sync-branch, then push again.                                       |
| Mauricio's comment is unclear                  | Help the person ask on the card. Do not guess.                          |

## Never

- Write or change application code.
- Move a card to `Approved Plan`.
- Invent requirements, or remove an open question without the person
  confirming Abril's answer.
- Plan changes to `prisma/` yourself.

## Done when

The plan file is committed and pushed, "Open questions for Abril" is empty,
the card is in `Planning` with the comment for Mauricio, and the person knows
they are waiting for approval.
