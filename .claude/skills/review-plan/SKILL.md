---
name: review-plan
description: Use when Mauricio wants to review a plan waiting for approval on a Trello card, or asks which plans are waiting. Records his decision on the card.
---

# Review plan

## Purpose

Help Mauricio review a plan and record his decision on the Trello card. The
conversation with Mauricio is technical. Anything posted on the card is read
by Flor and Jesi, so write it in Spanish product language following "Talking
with Flor and Jesi" in `AGENTS.md`.

## Steps

1. Find the card: the number or link Mauricio gives, or list the cards in
   `Planning` whose latest comment says the plan is ready.
2. Read the plan from its branch:

   ```
   git fetch origin
   git ls-tree --name-only origin/<branch> docs/plans/
   git show origin/<branch>:docs/plans/<file>
   ```

3. Review it:
   - Part 1: concrete and in product terms; "How we will know it works" can
     be checked by Abril; "Out of scope" is stated; "Open questions for
     Abril" is empty.
   - Part 2: follows `docs/code-patterns.md`; steps are small (one commit
     each), test first, in a sensible order; no new dependencies without a
     reason; risks are named.
   - Database: the plan changes nothing in `prisma/`. If the card needs a new
     field, table or sample data, Juan's pull request adding it must already
     be merged and linked under "Database change".
   - Size: more than about six steps suggests splitting the card.
4. Report to Mauricio: a recommendation (approve or ask for changes) and the
   issues, most important first.
5. Mauricio decides. Never decide for him.
   - Approve: move the card to `Approved Plan` with the Trello connector (this
     records his user as the approver) and comment "Plan aprobado." plus any
     notes. Approving on GitHub alone does not count: implement-ticket only
     accepts the move into `Approved Plan`.
   - Changes: draft a comment explaining what to change and why; show it;
     post it after his "ok". The card stays in `Planning`.

## Never

- Approve without Mauricio's explicit decision.
- Edit the plan file.

## Done when

The card is in `Approved Plan` with Mauricio's comment, or in `Planning` with
his requested changes.
