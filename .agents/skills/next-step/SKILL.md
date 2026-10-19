---
name: next-step
description: Use when the person asks where they are or what comes next, seems lost, or comes back to a card after a break. Also use when their review request was merged, to close the card. Do not use to start a new card (use start-ticket).
---

# Next step

## Purpose

Look at the real state and say in plain words which step the person is on and
what comes next. It only reads, except for the few actions in step 4, each
after the person's "ok".

## Steps

1. Find their cards, without changing anything:
   - Their Trello user is the user connected to your Trello connector.
   - `git branch --show-current`, `git status --short` and
     `git branch -a --list "*feat/*"`.
   - With the Trello connector, the cards where they are a member in
     `Planning`, `Approved Plan`, `In Progress` or `To Check`, plus the card of
     the current `feat/<n>-...` branch.
2. For each of those cards, collect:
   - Column, latest comments, and in the activity the latest move into
     `Approved Plan`: who made it and when.
   - Whether `docs/plans/<n>-*.md` exists (on another branch, read it with
     `git show origin/feat/<n>-...:docs/plans/<file>`), its "Open questions
     for Abril", its "Database change" (if it names a pull request from
     Juan, check it with `gh pr view <number> --json state`), and the date
     of its last commit.
   - Whether a "plan ready for review" comment was posted after that last
     plan commit, and whether Mauricio commented after it.
   - Step commits: `git log main..origin/feat/<n>-... --oneline`. On the
     current branch, also unpushed commits: `git log @{u}..HEAD --oneline`.
   - The review request:
     `gh pr view feat/<n>-... --json state,url,reviewDecision,mergeable,statusCheckRollup,reviews,comments`.
     If `gh` does not work, say you cannot see GitHub instead of guessing.
3. For each card, use the first row that matches. "Approved" means the latest
   move into `Approved Plan` was made by `mauriciocuello3` after the last
   plan commit; a comment or a move by someone else does not count.

   | State                                                                        | Tell them                                                           | Next                                  |
   | ---------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------- |
   | Unsaved changes on the current branch                                        | Name the files                                                      | Usually implement-ticket              |
   | Saved changes not on GitHub yet                                              | Say what they are; only on this computer                            | Offer to push (step 4)                |
   | Review request merged                                                        | The card is finished                                                | Offer to close it (step 4)            |
   | Review request closed without merging                                        | It was closed                                                       | ask-for-help (Juan)                   |
   | Review request open, with conflicts                                          | It clashes with newer changes                                       | sync-branch                           |
   | Review request open, an automatic check failed                               | A check failed on GitHub                                            | check-work                            |
   | Review request open, changes requested or Juan commented after the last push | Juan answered                                                       | address-review                        |
   | Review request open and approved                                             | Juan approved it and will merge it                                  | Wait                                  |
   | Review request open, no review yet                                           | Waiting for Juan                                                    | Wait                                  |
   | In `Approved Plan` or later, but not approved (see above)                    | Not approved yet, and why (who moved it, or the plan changed after) | ask-for-help (Mauricio)               |
   | Approved, plan steps missing                                                 | Ready to build, or k of N steps done                                | implement-ticket                      |
   | Approved, every plan step saved, no review request                           | Finished building                                                   | check-work, then open-pr              |
   | `Planning`, no plan file                                                     | The plan is not written                                             | plan-ticket                           |
   | `Planning`, open questions for Abril                                         | Waiting for Abril's answers                                         | Ask Abril, then plan-ticket           |
   | `Planning`, Juan's database pull request not merged                          | Waiting for Juan                                                    | Wait                                  |
   | `Planning`, Mauricio commented after the last plan commit                    | Mauricio asked for changes                                          | plan-ticket                           |
   | `Planning`, plan complete but not sent to Mauricio                           | The plan is ready to send                                           | plan-ticket                           |
   | `Planning`, plan sent, no new comments                                       | Waiting for Mauricio                                                | Wait                                  |
   | No cards in progress, on `main`                                              | No card in progress                                                 | start-ticket with a card from `To Do` |

   If other rows also match (for example a failed check behind a conflict),
   mention them in one line so nothing is hidden. If they have more than one
   card, tell them the state of each in one line and ask which one they want
   to continue. Continuing a card that is not the
   current branch means switching to it (step 4).

4. Actions this skill may take, each only after the person's "ok":
   - Switch to a card's branch, when there are no unsaved changes:
     `git switch feat/<n>-...` (it also works when the branch is only on
     GitHub).
   - Push saved changes: `git push`.
   - Close a finished card: move it to `Done` with the Trello connector, run
     `git switch main`, then `node scripts/git-sync.mjs`, and tell them they
     are ready for the next card.

After an action, go through the table again and tell them what comes next.

## Never

- Change files, commit, or move cards, except as described in step 4.
- Say a card is ready to build without checking who approved it.

## Done when

The person knows where each of their cards stands and which skill comes next.
