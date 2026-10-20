---
name: plan-ticket
description: Use when the person wants to write the plan for their current card, or to revise it after Mauricio's comments. Do not use to write application code (use implement-ticket) or to approve a plan.
---

# Plan ticket

## Purpose

Write `docs/plans/<n>-<description>.md` from the template with the person, in
Spanish and only from the product side, and open it as a draft review request
(pull request) so Mauricio can comment on it and approve it.

## Before you start

1. The current branch is `feat/<n>-<description>` (`git branch --show-current`).
   On `main`, use start-ticket.
2. Read card `n` with the Trello connector. It must be in `Planning`. If it is
   in `Approved Plan`, `In Progress` or `To Check` and they want to change the
   plan, warn them that Mauricio will have to approve it again. If they
   agree, move the card back to `Planning` now, before changing the plan
   file, so the card never shows as approved with a changed plan.
3. `git status --short` shows nothing, or only the plan file.

## Steps

1. Gather context: the card's description, checklists, comments and link.
   When revising, also read the current plan and Mauricio's comments newer
   than the last commit of this card's plan
   (`git log -1 --format=%cI -- docs/plans/<n>-<description>.md`), both on
   Trello (user `mauriciocuello3`) and on the draft review request:

   ```
   gh pr view --json number,url,isDraft,comments,reviews
   gh api repos/<owner>/<repo>/pulls/<number>/comments
   ```

   The second command returns comments on specific lines of the plan. Take
   `<owner>/<repo>` from `git remote get-url origin`. Compare dates in UTC.

2. Read the code the card touches, only to understand how it works today
   (what Abril sees, which cases exist). Do not design the code: the
   technical decisions are taken while building (implement-ticket).
3. New plan only: copy `docs/plans/_template.md` to
   `docs/plans/<n>-<description>.md`, where `<n>-<description>` is the branch
   name without `feat/`. Old plans in English are rewritten with the
   template when revised.
4. Write the plan with the person, one section at a time, following the
   template. Everything is in Spanish and in product language: no file
   names, functions, libraries or code, in the plan or in what you tell the
   person.
   - "Qué cambia para Abril" and "Comportamiento esperado": concrete
     examples Abril would recognise ("un producto de 800 pesos se ve como
     $ 800"). Ask whether it matches what Abril asked.
   - "Qué cambia respecto de hoy": what works differently afterwards, or
     "Nada: solo se agrega …".
   - "Qué vamos a probar": every case of the expected behaviour, the unusual
     cases (empty list, zero, very long names, cents) and what must not
     change. Each case becomes an automatic check (test) later. Propose the
     unusual cases yourself and ask whether they make sense.
   - "Cómo lo comprueba Abril": the page to open, what to do and what to
     see, with invented data only.
   - "Pasos": numbered, one product sentence each; each becomes one saved
     step (commit) that starts with a test. One step is fine for a small
     card.
   - "Información nueva para guardar", "Fuera de esta tarjeta", "Riesgos
     para el negocio".
   - Anything nobody knows goes into "Preguntas abiertas para Abril". Never
     fill a gap by guessing.
5. Check whether the plan is blocked. It is blocked when "Preguntas abiertas
   para Abril" is not empty, or when the card needs to store something new
   (a new field, table or sample data in the database: only Juan changes
   the database). If it is blocked, do all of this in one go, then stop:
   - Tell them you will save the plan as a draft so it is not lost, and wait
     for their "ok". Then save it with the `git` commands in step 7, without
     opening the review request and without the card comment: saving a
     draft does not ask Mauricio for anything.
   - Open questions: help them phrase the questions so they can send them to
     Abril.
   - Database: use ask-for-help so Juan adds it first in his own pull
     request.

   Continue when the answers are in, or when Juan's pull request is merged
   (link it under "Información nueva para guardar").

6. Read the whole plan back to them in two or three sentences (what changes
   for Abril, how many steps, what will be tested). Show the card comment
   from step 7 too. Ask whether it is ok to send the plan to Mauricio, and
   wait. That "ok" covers saving, opening the review request and posting the
   comment.
7. Save and share. If the plan had been approved before, first add a line
   under "Cambios después de la aprobación" with today's date, what changed
   and why.

   ```
   git add docs/plans/<n>-<description>.md
   git commit -m "docs: add plan for #<n>"
   git push
   ```

   When revising, use `docs: update plan for #<n>`. Then open the draft
   review request. Write its description to `.git/PR_BODY.md` (inside
   `.git`, so it is never committed), in English, for example:

   ```
   Plan for #<n>, waiting for Mauricio's approval.

   Trello card: <card link>
   Plan: docs/plans/<n>-<description>.md

   The steps will be added to this pull request after the plan is approved.
   ```

   ```
   node scripts/git-open-pr.mjs --draft --body-file .git/PR_BODY.md
   ```

   If it says the review request already exists, the new plan commit is
   already in it. If it prints a GitHub link instead (`gh` is not
   available), guide them to create it as a draft, following the script's
   instructions, and ask for the address of the page that opens.

   Then post this card comment with the Trello connector, in the person's
   language, for example: "Plan listo para revisar @mauriciocuello3:
   <review request link>". When revising: "Plan actualizado
   @mauriciocuello3: <review request link>".

8. Tell them the plan is waiting for Mauricio, and that nothing else happens
   on this card until Mauricio moves it to `Approved Plan` or comments. A
   comment like "approved" does not count: only the move does.

## What to tell the person

- Start: "Let's agree on how it should work for Abril, with examples. That
  is the whole plan; I'll take care of how to build it."
- Steps: "We'll do it in two steps: first …, then …"
- End: "Mauricio has the plan in a draft review request (pull request) and
  can comment on it there. When it is approved, tell me 'let's start
  building'."

## When something goes wrong

| Situation                                      | What to do                                                                  |
| ---------------------------------------------- | --------------------------------------------------------------------------- |
| The card asks for something nobody understands | Write it as an open question for Abril.                                     |
| The card needs a database change               | Step 5: save the draft, use ask-for-help (Juan), wait for his pull request. |
| The plan needs more than about six steps       | Suggest splitting the card; use ask-for-help to propose it to Mauricio.     |
| `git push` is rejected                         | Use sync-branch, then push again.                                           |
| `GitHub did not accept the pull request`       | Use ask-for-help (Juan).                                                    |
| Mauricio's comment is unclear                  | Help the person ask in the review request. Do not guess.                    |

## Never

- Write or change application code.
- Put technical content in the plan (file names, functions, libraries, code).
- Move a card to `Approved Plan`, or mark the review request as ready.
- Invent requirements, or remove an open question without the person
  confirming Abril's answer.
- Plan changes to `prisma/` yourself.

## Done when

The plan file is committed and pushed, "Preguntas abiertas para Abril" is
empty, the draft review request exists, the card is in `Planning` with the
comment for Mauricio, and the person knows they are waiting for approval. Or,
when the plan is blocked: the draft is saved, the questions are with Abril or
the database change is with Juan, and the person knows what they are waiting
for.
