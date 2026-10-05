# Contributing

How this team works. Read this once before your first ticket.

Everything in this repository — code, comments, commit messages, pull requests —
is written in **English**. The repository is public.

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

### 1. Start

```bash
node scripts/ticket-start.mjs <ticket-number> <short description>
# example: node scripts/ticket-start.mjs 42 product list page
```

This updates `main`, creates your branch (`feat/42-product-list-page`) and pushes it.

### 2. Plan before writing code

Write a short markdown document: what you are going to do and how.
Link it on the Trello card.

**Wait for the manager to approve the plan before you implement.**
This is the checkpoint — it is much cheaper to fix a plan than a pull request.

### 3. Implement

Work on your branch. Commit often, in small steps.

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add product list page
fix: correct total when an order has no items
test: cover empty product list
chore: update dependencies
docs: explain the database setup
```

### 4. Stay up to date

If you have been working for a while, or the pull request shows conflicts:

```bash
node scripts/git-sync.mjs
```

### 5. Open the pull request

```bash
node scripts/git-open-pr.mjs
```

Fill in the template: what changed, and how the reviewer can check it works.

### 6. Review

Juan reviews every pull request. CI must be green before it can be merged.

If there are comments, push more commits to the same branch — the pull request
updates itself. When it is approved, it gets merged and the card moves to **Done**.

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

```bash
git clone <repository-url>
cd <repository>
npm install
cp .env.example .env     # then fill in your own DATABASE_URL and DIRECT_URL
npx prisma migrate dev
npm run db:seed
npm run dev
```

Each person has their own Neon database branch, so a migration you run never
breaks anybody else. Ask Juan for both your pooled `DATABASE_URL` and direct
`DIRECT_URL`.
