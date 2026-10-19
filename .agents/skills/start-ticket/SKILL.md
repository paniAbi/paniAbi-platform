---
name: start-ticket
description: Use when the person wants to start working on a new Trello card, for example "I want to start card 42", or pastes a card link to begin. Do not use for a card that was already started (use next-step).
---

# Start ticket

## Purpose

Take a card from `To Do`, explain it in product terms, create the person's
working copy (branch) and move the card to `Planning`.

## Before you start

1. You need the card number or link. If the person did not give it, ask.
2. The person you are talking with is the user connected to your Trello
   connector. Find out their Trello user before anything else.
3. Look at their computer first, without changing anything:
   `git branch --show-current`, `git status --short` and
   `git branch --list "feat/*"`.
   - Unsaved changes: tell them which files, and use next-step to find which
     card they belong to. The new card can only start once there are no
     unsaved changes; usually that means saving them as a step of their card
     (implement-ticket). Never discard them without an explicit "yes,
     discard them".
   - Another card in progress, once there are no unsaved changes (they are
     on a `feat/` branch, have other
     `feat/` branches, or are a member of a card in `Planning`,
     `Approved Plan` or `In Progress`): say which card and in which step it
     is, and ask whether they want to start the new one anyway. Continue
     only after their "yes".
4. Read the card with the Trello connector. The board, columns and labels are
   in the "Trello board" section of `AGENTS.md`. Find the card by the number
   in its URL. Label names match regardless of capital letters
   (`Platform` is `platform`).
5. Check, in this order. If a check fails, stop and explain it in product
   terms:
   - It has the `automation` label: it does not need code. Tell them it is
     solved outside the repository and stop.
   - It has no `platform` label: ask Mauricio to label it (ask-for-help) and
     stop.
   - It is in `Backlog`: it is not prioritised yet; Mauricio must move it to
     `To Do` first. Stop.
   - It is in a later column (`Planning` or after): look for its branch with
     `git branch -a --list "*feat/<n>-*"`. If it exists, the card was already
     started: use next-step. If it does not exist, the card skipped the
     start: use ask-for-help so Mauricio moves it back to `To Do`, and stop.
   - Another person is a member of the card: do not take it. Tell them who
     has it.

## Steps

1. Explain the card in two to four sentences: what Abril needs and why it
   matters for the bakery, using only what the card says. If the card does
   not say why, or leaves something open, say so instead of guessing; it
   becomes an open question for Abril in the plan (plan-ticket). Ask:
   "Does this match what Abril told you?" Wait. Their "yes" is the "ok" to
   create the working copy. If they disagree, help them write a comment on
   the card and stop.
2. Choose a short English description of two to four words from the card
   title (translate it if the card is in Spanish), for example
   `product list page`.
3. Run:

   ```
   node scripts/ticket-start.mjs <card-number> <short english description>
   ```

4. If the script fails, see "When something goes wrong".
5. Make the person a member of the card, so nobody else takes it. If the
   connector cannot add members, ask them to add themselves in Trello (open
   the card, then "Members"). Read the card again to confirm they are a
   member. If they cannot, use ask-for-help (Juan).
6. With the Trello connector, move the card to `Planning`.
7. Tell them their working copy is ready and the next step is the plan
   (plan-ticket).

## What to tell the person

Always in their language and following "Talking with Flor and Jesi" in
`AGENTS.md`.

- Start: "Let me read card 42 and tell you what I understand."
- After the script: "I created your working copy (branch) for this card.
  Everything we change stays there until Juan reviews it, so nothing can break
  the version that works."
- End: "Next we write the plan: what will change for Abril and how we'll build
  it. Mauricio approves it before we build anything."

## When something goes wrong

| What the script said                                        | What to do                                                                                                                                                                                                        |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `STOP: you have changes that are not saved in a commit yet` | Show which files changed and explain they are unsaved work from before. Ask what they want to do; use next-step to find which card they belong to. Never discard changes without an explicit "yes, discard them". |
| `STOP: a previous merge is not finished yet`                | Use sync-branch to finish or undo it.                                                                                                                                                                             |
| `could not reach GitHub`                                    | Ask them to check their internet connection, then run the script again. If it keeps failing, use ask-for-help (Juan).                                                                                             |
| `could not be updated`                                      | Do not try to fix it. Use ask-for-help (Juan).                                                                                                                                                                    |
| `could not be pushed to GitHub`                             | Probably missing access to the repository. Use ask-for-help (Juan).                                                                                                                                               |
| `That branch already exists`                                | The card was started before. Use next-step to see where it was left.                                                                                                                                              |

## Never

- Create branches with `git` commands directly.
- Take a card that has another member.
- Start an `automation` card or a card from `Backlog`.

## Done when

The person is on `feat/<n>-<description>`, the branch is on GitHub, the card
is in `Planning` with the person as a member, and they know the next step is
plan-ticket.
