# Contributing

How this team works. Read this once before your first ticket.

Everything in this repository — code, comments, commit messages, pull requests —
is written in **English**. The repository is public. The one exception is
plans (`docs/plans/`), which are written in **Spanish**, from the product side.

---

## Roles

| Role           | Who        | Responsibility                                                     |
| -------------- | ---------- | ------------------------------------------------------------------ |
| Manager        | Mauricio   | Prioritises the backlog and approves plans before implementation   |
| Infrastructure | Juan       | Owns the repository, CI and test setup. Reviews every pull request |
| Features       | Jesi, Flor | Take tickets, plan, implement and open pull requests               |

---

## The two kinds of ticket

**Platform** — touches the application code. Goes through the full Git flow below.

**Automation / content** — does not touch the code (leaflets, social posts, documents).
Solved with a connector or a skill. No branch, no pull request: show the result on the card.

---

## Working on a platform ticket

You work by telling your agent (Codex or Claude Code) what you want, in your
own words. Each step has a skill that knows how to do it safely; the agent
picks it for you.

| You say                        | What happens                                                                   | Skill              |
| ------------------------------ | ------------------------------------------------------------------------------ | ------------------ |
| "I want to start card 42"      | The agent explains the card, creates your branch, moves the card to Planning   | `start-ticket`     |
| "Let's write the plan"         | You agree on how it should work for Abril; the plan opens as a draft PR        | `plan-ticket`      |
| "Let's start building"         | Only after Mauricio approves: one step at a time, test first, one commit each  | `implement-ticket` |
| "Quiero verlo funcionando"     | Starts the app on your computer and walks the plan's "Cómo lo comprueba Abril" | `try-it-out`       |
| "Is everything ok?"            | Runs lint, type check, tests and build, and explains failures                  | `check-work`       |
| "Bring the latest changes"     | Merges `main` into your branch and helps with conflicts                        | `sync-branch`      |
| "I'm done"                     | Marks the pull request ready for Juan and moves the card to To Check           | `open-pr`          |
| "Juan left comments"           | Explains the review and applies the changes with you                           | `address-review`   |
| "Where am I?" / "What's next?" | Tells you which step you are on                                                | `next-step`        |
| "I'm stuck"                    | Writes a clear message for Juan or Mauricio on the card                        | `ask-for-help`     |

**The plan:** written in Spanish and only from the product side: what changes
for Abril, how it should behave (with examples), what will be tested and how
Abril can check it. The agent decides how to build it, and Juan reviews that in
the pull request. When the plan is ready, the agent opens a **draft pull
request** with it, and Mauricio comments on the plan there.

**The plan checkpoint:** Mauricio approves a plan by moving its card to
**Approved Plan**. The agent will not build anything before that — it is much
cheaper to fix a plan than a pull request. The steps are then added to the same
pull request, which becomes ready for Juan's review when you say you are done.

### If you need to run the steps yourself

```bash
node scripts/ticket-start.mjs <ticket-number> <short description>
node scripts/git-sync.mjs
node scripts/check.mjs
node scripts/git-open-pr.mjs
```

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/):
`feat:`, `fix:`, `test:`, `docs:`, `chore:`.

### Review

Juan reviews every pull request. CI must be green before it can be merged. If
there are comments, new commits on the same branch update the pull request.
When it is merged, the card moves to **Done**.

---

## Rules

**Nobody pushes to `main`.** It is protected. Everything enters through a pull request
with an approval.

**No real customer data.** This repository is public. Use invented sample data — no real
prices, phone numbers, addresses or customer names.

**Never commit `.env`.** Copy `.env.example` and fill in your own values.

**If you are stuck for more than twenty minutes, ask.** Being blocked in silence is
more expensive than asking.

---

## Local setup

Follow [README.md](README.md): it lists the tools to install and the steps to
run the app on your computer.

Everyone runs the app against their own local database in Docker:
`cp .env.example .env`, then `npm run db:local`. Nothing you create on your
computer reaches the live site.

**Database changes go through Juan.** Only Juan edits `prisma/` and runs
migrations. If your ticket needs a new field or table, ask Juan before you
plan it; he adds it first in his own pull request.

## Agent setup

Do this once, after the local setup:

- [ ] Open Codex (Flor, Jesi) or Claude Code (Juan, Mauricio) **in the
      repository folder**. Skills are found from there.
- [ ] Connect Trello to your agent, and make sure your Trello user is a member
      of the board.
- [ ] Install the GitHub CLI (`winget install GitHub.cli` on Windows,
      `brew install gh` on macOS) and log in with `gh auth login`.
- [ ] Check it works: ask your agent "what's next?". It should answer with the
      `next-step` skill.
