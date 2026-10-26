---
name: try-it-out
description: Use when the person wants to see their change working on their computer, for example "quiero verlo funcionando", "I want to try it" or "show me how it looks". Do not use to run the automatic checks (use check-work) or to build a step (use implement-ticket).
---

# Try it out

## Purpose

Take the person from a built step to seeing it on their own screen, following
the plan's "Cómo lo comprueba Abril" one step at a time. They confirm what
they see; you never say it works on their behalf.

## Before you start

1. The branch is `feat/<n>-<description>` (`git branch --show-current`). On
   `main`, use next-step.
2. Find the plan: `docs/plans/<n>-*.md`. The script is "Cómo lo comprueba
   Abril" ("How we will know it works" in older English plans). Without a
   plan, use next-step.
3. Does the card change anything visible? Look at the plan and at
   `git diff main...HEAD --name-only`. If nothing under `src/` changed and the
   plan says the web does not change, tell them there is nothing to look at
   on screen for this card, and that trying it does not apply here. Stop.
4. If no step that changes something visible is saved yet
   (`git log main..HEAD --oneline`), tell them there is nothing to see yet and
   suggest implement-ticket. Stop.

## Steps

1. Prepare the database. Run `npm run db:local`. It checks `.env` and Docker,
   starts the local database and adds the tables and sample products. It is
   safe to repeat and never erases data.

   | What it said                                | What to do                                                                                                                                                                   |
   | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `The local database is ready`               | Go on.                                                                                                                                                                       |
   | `STOP: Docker is not running`               | Ask them to open Docker Desktop and wait until it says "Engine running". Run it again when they say it is open.                                                              |
   | `STOP: there is no .env file`               | Follow step 3 of section 2 in `README.md`: they run `cp .env.example .env` themselves.                                                                                       |
   | `STOP: ... does not point at this computer` | Their `.env` still points at the live site. Stop and send them to "Already had the app running before the local database?" in `README.md`. They copy the example themselves. |
   | Anything else, or it fails twice            | Do not try fixes. Explain in one sentence that the local database did not start, and use ask-for-help (Juan).                                                                |

2. Start the app, unless it is already running. Check first:
   `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` answers
   `200` or `307` when it is. If it is not running, start `npm run dev` so it
   keeps running while you keep talking (in the background or in a separate
   terminal), and wait until it prints the address it is using (usually
   `http://localhost:3000`; if that port is busy it picks another one, so use
   the address it printed).
3. If the app does not start, or the page answers with an error, do not
   insist and do not try fixes on your own. Tell them in plain words what
   happened ("the web did not start on your computer") and use ask-for-help
   (Juan). Stop.
4. Give them the exact address to open: the local address plus the page the
   script mentions (for example `http://localhost:3000/products`). If the
   script names the live site (`pani-abi-platform.vercel.app`), use the same
   page on their computer instead: the live site does not have their change
   yet.
5. Walk the script one step at a time. For each step, say what to open or do
   and what they should see, then ask what they saw. Wait for their answer
   before the next step.
6. Compare what they saw with what the script says.
   - It matches: go to the next step.
   - It does not match: stop the script. Explain the difference in product
     terms ("the price shows ,00 and the plan says it should not"). If it is
     something the plan asks for, offer to fix it with implement-ticket. If
     you do not know why it happens, use ask-for-help. Do not suggest
     "Terminé" while something does not match.
7. When every step matched, tell them the change works as the plan says, and
   suggest what comes next: more steps (implement-ticket) or "Terminé"
   (open-pr). Tell them they can stop the app with `Ctrl+C` when they are
   done.

## What to tell the person

- Start: "Vamos a verlo funcionando en tu computadora, siguiendo el guion del
  plan."
- Each step: "Abrí esta dirección … ¿Qué ves?"
- Mismatch: "Esto no coincide con el plan: … ¿Querés que lo corrijamos?"
- End: "Todo coincide con lo que dice el plan."

## Never

- Say a step works without the person confirming what they saw.
- Change code, `.env` or anything in `prisma/` in this skill.
- Run a database command other than `npm run db:local`.
- Use the live site to try an unmerged change.
- Create anything with real data. Only invented data, and name test products
  `TEST - ...`.

## Done when

The person saw every step of the script match on their screen, or the
mismatch or problem is with implement-ticket or with Juan through
ask-for-help.
