---
name: review-plan
description: Use when Mauricio wants to review a plan waiting for approval on a Trello card, or asks which plans are waiting. Records his decision on the card.
---

# Review plan

## Purpose

Help Mauricio review a plan in its draft pull request and record his
decision. The conversation with Mauricio is technical. Anything posted on the
card or the pull request is read by Flor and Jesi, so write it in Spanish
product language following "Talking with Flor and Jesi" in `AGENTS.md`.

## Steps

1. Find the card: the number or link Mauricio gives, or list the cards in
   `Planning` whose latest comment says the plan is ready.
2. Read the plan and its draft pull request:

   ```
   gh pr view <branch> --json number,url,isDraft,files,comments,reviews
   gh api repos/<owner>/<repo>/pulls/<number>/comments
   git fetch origin
   git show origin/<branch>:docs/plans/<file>
   ```

   If there is no draft pull request (an older plan), read the plan from the
   branch and review it the same way.

3. Review it against `docs/plans/_template.md`:
   - In Spanish and in product language only: no file names, functions,
     libraries or code.
   - "Comportamiento esperado" has concrete examples Abril would recognise.
   - "Qué vamos a probar" covers every example, the unusual cases (empty,
     zero, very long, cents) and what must not change.
   - "Cómo lo comprueba Abril" can be followed by someone who is not a
     programmer.
   - "Pasos" are small (one commit each) and in a sensible order; more than
     about six suggests splitting the card.
   - "Preguntas abiertas para Abril" is empty.
   - Database: if the card needs to store something new, Juan's pull request
     adding it must already be merged and linked under "Información nueva
     para guardar". The plan changes nothing in `prisma/`.
   - Older comments in the pull request are answered by the current plan.
4. Report to Mauricio: a recommendation (approve or ask for changes) and the
   issues, most important first.
5. Mauricio decides. Never decide for him.
   - Approve: move the card to `Approved Plan` with the Trello connector (this
     records his user as the approver) and comment "Plan aprobado." plus any
     notes on the card. A GitHub "Approve" does not count, and do not mark
     the pull request as ready: open-pr does that when the steps are built.
   - Changes: draft the comments in Spanish product language, each saying
     what to change and why, on the plan line it refers to when there is
     one. Show them and post them after his "ok", as one review with line
     comments. Write `.git/PLAN_REVIEW.json`:

     ```json
     {
       "event": "COMMENT",
       "body": "<resumen>",
       "comments": [
         {
           "path": "docs/plans/<file>",
           "line": 12,
           "body": "<comentario>"
         }
       ]
     }
     ```

     Then post it:

     ```
     gh api repos/<owner>/<repo>/pulls/<number>/reviews --method POST --input .git/PLAN_REVIEW.json
     ```

     Then comment on the card that the plan has comments in the pull
     request. The card stays in `Planning`.

## Never

- Approve without Mauricio's explicit decision.
- Edit the plan file.
- Mark the draft pull request as ready.

## Done when

The card is in `Approved Plan` with Mauricio's comment, or in `Planning` with
his requested changes in the pull request.
