---
name: open-pr
description: Use when the person says the card is finished and wants it reviewed, for example "I'm done". Do not use while plan steps are missing (use implement-ticket) or to send fixes after review comments (use address-review).
---

# Open pull request

## Purpose

Open the review request (pull request) for Juan, with a clear description, and
move the card to `To Check`.

## Before you start

1. The branch is `feat/<n>-<description>` and `git status --short` is empty.
2. `docs/plans/<n>-*.md` exists and every step in its part 2 has a commit
   (`git log main..HEAD --oneline`).
3. `node scripts/check.mjs` passes. If not, use check-work first.

## Steps

1. Write the description to `.git/PR_BODY.md` (inside `.git`, so it is never
   committed), following `.github/pull_request_template.md`, in English:
   - Trello card: the card link. Plan: the plan file path.
   - What this changes: two or three lines from part 1 of the plan.
   - How to check it works: concrete steps from "How we will know it works"
     (page address, what to click, what appears).
   - Checklist: tick only what is true.
   - Notes for the reviewer: the plan's risks and anything you were unsure
     about.
2. Summarise it to the person in their language. Wait for "ok".
3. Run:

   ```
   node scripts/git-open-pr.mjs --body-file .git/PR_BODY.md
   ```

4. If the script prints a GitHub link instead of creating the review request
   (`gh` is not available), guide them: open the link, paste the title it
   printed, paste the contents of `.git/PR_BODY.md`, and click "Create pull
   request".
5. With the Trello connector, move the card to `To Check` and comment with the
   review request link.
6. Tell them Juan will review it. When Juan comments, use address-review.

## When something goes wrong

| What the script said                     | What to do                                         |
| ---------------------------------------- | -------------------------------------------------- |
| `STOP: there is no plan for ticket`      | The plan is missing on this branch. Use next-step. |
| `could not push your branch`             | Use sync-branch, then run the script again.        |
| `GitHub did not accept the pull request` | Use ask-for-help (Juan).                           |

## Never

- Open a review request with failing checks.
- Tick a checklist item that is not true.

## Done when

The review request exists on GitHub and the card is in `To Check` with its
link.
