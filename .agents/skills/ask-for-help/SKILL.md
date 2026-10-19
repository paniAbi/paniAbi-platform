---
name: ask-for-help
description: Use when the person says they are stuck or confused, when another skill says to ask for help, or when you are not sure how to continue safely. Do not use for questions the card or the plan already answer.
---

# Ask for help

## Purpose

Turn being stuck into a clear message for the right person. Team rule: after
twenty minutes stuck, ask.

## Steps

1. Choose who to ask:

   | About                                                    | Ask                         | Trello user       |
   | -------------------------------------------------------- | --------------------------- | ----------------- |
   | Git, GitHub access, setup, CI, database, review comments | Juan                        | `blacky57`        |
   | Plan, priorities, scope, splitting a card                | Mauricio                    | `mauriciocuello3` |
   | How the product should behave                            | Abril, through Flor or Jesi | —                 |

   If Juan is away (or has not answered for a day), tell Mauricio too: he
   decides whether the card waits, is split, or they switch to another card.

2. Draft a short message in the person's language, so they understand what
   they approve (Juan and Mauricio read Spanish; error text can stay as it
   is):
   - Card and step ("Card 42, step 2 of 4"), or "no card" for setup problems.
   - What we were trying to do, in product terms.
   - What happened: a one-line summary. Include the exact error only when
     asking Juan, and first remove anything secret from it: passwords,
     tokens, and database addresses with a user and password (for example
     `postgresql://user:password@...`). Say "(password removed)" where you
     cut it.
   - What we already tried.
   - What we need from them.
3. Show the draft. After their "ok", post it as a card comment with the Trello
   connector, mentioning the Trello user (for example `@blacky57`). If there
   is no card (for example the app does not start on their computer), give
   them the text to send to Juan or Mauricio themselves. For Abril, always
   give them the text to send her themselves.
4. Tell them what they can safely do while they wait, if anything. Leave
   unsaved work as it is; do not save, undo or delete it while waiting.
5. If a secret appeared in an error, tell them and mention it to Juan, so he
   can decide whether to change it.

## Never

- Post without the person's "ok".
- Include `.env` contents, passwords or tokens.
- Try risky fixes while waiting for an answer.

## Done when

The right person has a clear message and the person knows what to do
meanwhile.
