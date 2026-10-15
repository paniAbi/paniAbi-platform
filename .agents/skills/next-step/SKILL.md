---
name: next-step
description: Use when the person asks where they are or what comes next, seems lost, or comes back to a card after a break. Also use when their review request was merged, to close the card. Do not use to start a new card (use start-ticket).
---

# Next step

## Purpose

Look at the real state and say in plain words which step the person is on and
what comes next. The only action this skill takes is closing a card whose
review request was merged.

## Steps

1. Collect the state without changing anything:
   - `git branch --show-current` and `git status --short`.
   - On `feat/<n>-...`: card `n` (column and latest comments) with the Trello
     connector; whether `docs/plans/<n>-*.md` exists and its "Open questions
     for Abril"; `git log main..HEAD --oneline`; and, if `gh` works,
     `gh pr view --json state,url,reviewDecision`.
2. Use the first row that matches:

   | State                                                             | Tell them                                 | Next                                         |
   | ----------------------------------------------------------------- | ----------------------------------------- | -------------------------------------------- |
   | Uncommitted changes                                               | There are unsaved changes; name the files | Usually implement-ticket, to finish the step |
   | On `main`                                                         | No card in progress                       | start-ticket with a card from `To Do`        |
   | Review request merged                                             | The card is finished                      | Offer to close it (step 3)                   |
   | Card in `Planning`, no plan file                                  | The plan is not written                   | plan-ticket                                  |
   | Card in `Planning`, plan has open questions                       | Waiting for answers from Abril            | Ask Abril, then plan-ticket                  |
   | Card in `Planning`, waiting for a database change from Juan       | Waiting for Juan                          | Wait, then plan-ticket                       |
   | Card in `Planning`, Mauricio commented after the last plan commit | Mauricio asked for changes                | plan-ticket                                  |
   | Card in `Planning`, plan pushed, no new comments                  | Waiting for Mauricio                      | Wait                                         |
   | Card in `Approved Plan`, or `In Progress` with plan steps missing | Ready to build, or k of N steps done      | implement-ticket                             |
   | Card in `In Progress`, every plan step committed                  | Finished building                         | check-work, then open-pr                     |
   | Card in `To Check`, changes requested or new comments             | Juan answered                             | address-review                               |
   | Card in `To Check`, no review yet                                 | Waiting for Juan                          | Wait                                         |
   | Review request approved, not merged                               | Juan approved it and will merge it        | Wait                                         |

3. Closing a finished card, only after the person's "ok":
   - Move the card to `Done` with the Trello connector.
   - Run `git switch main`, then `node scripts/git-sync.mjs`.
   - Tell them they are ready for the next card.

## Never

- Change files, commit, or move cards, except when closing in step 3.

## Done when

The person knows where they are and which skill comes next.
