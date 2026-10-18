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
   card back to `Planning` now, before changing the plan file, so the card
   never shows as approved with a changed plan.
3. `git status --short` shows nothing, or only the plan file.

## Steps

1. Gather context: the card's description, checklists, comments and link.
   When revising, also read the current plan and Mauricio's comments (Trello
   user `mauriciocuello3`) newer than the last commit of this card's plan
   (`git log -1 --format=%cI -- docs/plans/<n>-<description>.md`). Compare
   both dates in UTC.
2. Read `docs/code-patterns.md` and the code the card touches. If the change
   uses Next.js features (pages, server actions, forms, data loading), list
   `node_modules/next/dist/docs/` and read the guide for those features.
3. New plan only: copy `docs/plans/_template.md` to
   `docs/plans/<n>-<description>.md`, where `<n>-<description>` is the branch
   name without `feat/`.
4. Write part 1, "What changes for Abril". Explain it to the person in their
   language (the file stays in English). Ask whether it matches what Abril
   asked. Anything nobody knows goes into "Open questions for Abril". Never
   fill a gap by guessing.
5. Write part 2, "How we will build it": files following
   `docs/code-patterns.md`; whether the database changes; numbered steps where
   each step is one small commit and starts with a test (one step is fine for
   a small card); risks for the reviewer. Each step must be explainable in one
   sentence of product language.
6. Check whether the plan is blocked. It is blocked when "Open questions for
   Abril" is not empty, or when the card needs a new field, table or sample
   data in the database (only Juan changes the database). If it is blocked,
   do all of this in one go, then stop:
   - Tell them you will save the plan as a draft so it is not lost, and wait
     for their "ok". Then save it with the commands in step 8. Saving a draft
     does not ask Mauricio for anything: do not post the step 8 comment.
   - Open questions: help them phrase the questions so they can send them to
     Abril.
   - Database: use ask-for-help so Juan adds it first in his own pull
     request.

   Continue when the answers are in, or when Juan's pull request is merged
   (link it under "Database change").

7. Explain part 2 in product terms: how many steps and what each one lets
   Abril do. No code. Show the card comment from step 8 too. Ask whether it
   is ok to send the plan to Mauricio, and wait. That "ok" covers saving,
   sharing and posting the comment.
8. Save and share. If the plan had been approved before, first add a line
   under "Changes after approval" with today's date, what changed and why.

   ```
   git add docs/plans/<n>-<description>.md
   git commit -m "docs: add plan for #<n>"
   git push
   ```

   When revising, use `docs: update plan for #<n>`. Then post this card
   comment with the Trello connector, in the person's language, for example:
   "Plan listo para revisar @mauriciocuello3:
   https://github.com/<owner>/<repo>/blob/<branch>/docs/plans/<file>".
   Take `<owner>/<repo>` from `git remote get-url origin`.

9. Tell them the plan is waiting for Mauricio, and that nothing else happens
   on this card until Mauricio moves it to `Approved Plan` or comments. A
   comment like "approved" does not count: only the move does.

## What to tell the person

- Start: "First let's agree on what will change for Abril. Then we'll decide
  how to build it."
- Part 2: "We'll do it in three steps: first …, then …, and finally …"
- End: "Mauricio has the plan. When it is approved, tell me 'let's start
  building'."

## When something goes wrong

| Situation                                      | What to do                                                                  |
| ---------------------------------------------- | --------------------------------------------------------------------------- |
| The card asks for something nobody understands | Write it as an open question for Abril.                                     |
| The card needs a database change               | Step 6: save the draft, use ask-for-help (Juan), wait for his pull request. |
| The plan needs more than about six steps       | Suggest splitting the card; use ask-for-help to propose it to Mauricio.     |
| `git push` is rejected                         | Use sync-branch, then push again.                                           |
| Mauricio's comment is unclear                  | Help the person ask on the card. Do not guess.                              |

## Never

- Write or change application code.
- Move a card to `Approved Plan`.
- Invent requirements, or remove an open question without the person
  confirming Abril's answer.
- Plan changes to `prisma/` yourself.

## Done when

The plan file is committed and pushed, "Open questions for Abril" is empty,
the card is in `Planning` with the comment for Mauricio, and the person knows
they are waiting for approval. Or, when the plan is blocked: the draft is
saved, the questions are with Abril or the database change is with Juan, and
the person knows what they are waiting for.
