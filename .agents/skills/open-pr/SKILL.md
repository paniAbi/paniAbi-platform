---
name: open-pr
description: Use when the person says the card is finished and wants it reviewed, for example "I'm done". Do not use while plan steps are missing (use implement-ticket) or to send fixes after review comments (use address-review).
---

# Open pull request

## Purpose

Mark the card's draft review request (pull request) ready for Juan, with a
clear description, and move the card to `To Check`. plan-ticket opened it as
a draft with the plan; the step commits are already in it.

## Before you start

1. The branch is `feat/<n>-<description>` and `git status --short` is empty.
2. `docs/plans/<n>-*.md` exists and every step under "Pasos" (part 2 in
   older plans) has a commit
   (`git log main..HEAD --oneline`).
3. Run `node scripts/check.mjs` now, even if it passed before; it must pass.
   If not, use check-work first.
4. Check the approval the same way implement-ticket does: the latest move
   of card `n` into `Approved Plan` was made by `mauriciocuello3`, after the
   last commit of the plan and before the first step commit.

If any of these fails, stop. Never mark the review request ready with steps
missing, not even "so Juan can start looking". If steps are
missing, offer to build them now (implement-ticket) or to leave the card as
it is for later; the work already saved is safe on GitHub.

## Steps

1. Write the description to `.git/PR_BODY.md` (inside `.git`, so it is never
   committed), following `.github/pull_request_template.md`, in English:
   - Trello card: the card link. Plan: the plan file path.
   - What this changes: two or three lines from "Qué cambia para Abril",
     in English.
   - How to check it works: concrete steps from "Cómo lo comprueba Abril"
     (page address, what to click, what appears).
   - Checklist: tick a box only after checking it. "The plan was approved"
     comes from check 4 above.
   - Notes for the reviewer: the technical decisions taken while building
     (from the step commit messages, `git log main..HEAD --format=%B`); the
     plan's business risks; every commit that is not a
     plan step (for example a fix from check-work or an older test that was
     updated) and why; anything under "Cambios después de la aprobación"; anything
     you were unsure about.
2. Summarise it to the person in their language, and say that the card will
   move to `To Check`. Wait for "ok".
3. Run:

   ```
   node scripts/git-open-pr.mjs --body-file .git/PR_BODY.md
   ```

   It replaces the draft's description with this one and marks it ready,
   which asks Juan for a review. On an older card without a draft, it
   creates the review request.

4. If the script prints a GitHub link instead of creating the review request
   (`gh` is not available), guide them one step at a time. If the draft
   review request exists: open it, edit its description and paste the text
   of `.git/PR_BODY.md` (show it so they can copy it), then click "Ready for
   review". If it does not exist (an older card): open the link, paste the
   title it printed and the description, and click "Create pull request".
   Then ask them to copy the address of the page that opens. It must look
   like `https://github.com/<owner>/<repo>/pull/<number>`; without it, do not
   move the card.
5. With the Trello connector, move the card to `To Check` and comment with the
   review request link, in the person's language.
6. Tell them Juan will review it. When Juan comments, use address-review.

## When something goes wrong

| What the script said                                                                                                       | What to do                                                                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `STOP: there is no plan for ticket`                                                                                        | The plan is missing on this branch. Use next-step.                                                                                                                                             |
| `could not push your branch`                                                                                               | Use sync-branch, then run the script again.                                                                                                                                                    |
| `GitHub did not accept the pull request`, `did not accept the new description` or `did not mark the pull request as ready` | Use ask-for-help (Juan).                                                                                                                                                                       |
| `The pull request already exists`                                                                                          | It was updated, not created. Do not comment the link again; if the card is not in `To Check`, move it there. The description on GitHub was not changed, so tell them if it is now out of date. |

## Never

- Mark a review request ready, or open one, with failing checks or missing
  plan steps, even when the person asks.
- Tick a checklist item you have not checked, even when the person asks.

## Done when

The review request exists on GitHub and the card is in `To Check` with its
link.
