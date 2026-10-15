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
2. Read the card with the Trello connector. The board, columns and labels are
   in the "Trello board" section of `AGENTS.md`. Find the card by the number
   in its URL.
3. Check, in this order. If a check fails, stop and explain it in product
   terms:
   - It has the `automation` label: it does not need code. Tell them it is
     solved outside the repository and stop.
   - It has no `platform` label: ask Mauricio to label it (ask-for-help) and
     stop.
   - It is not in `To Do`: if it is in a later column, use next-step. If it is
     in `Backlog`, it is not prioritised yet; Mauricio must move it first.
   - Another person is a member of the card: do not take it. Tell them who
     has it.

## Steps

1. Explain the card in two to four sentences: what Abril needs and why it
   matters for the bakery. Ask: "Does this match what Abril told you?" Wait.
   If they disagree, help them write a comment on the card and stop.
2. Choose a short English description of two to four words from the card
   title (translate it if the card is in Spanish), for example
   `product list page`.
3. Run:

   ```
   node scripts/ticket-start.mjs <card-number> <short english description>
   ```

4. If the script fails, see "When something goes wrong".
5. With the Trello connector, add the person's Trello user as a member of the
   card and move the card to `Planning`.
6. Tell them their working copy is ready and the next step is the plan
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
