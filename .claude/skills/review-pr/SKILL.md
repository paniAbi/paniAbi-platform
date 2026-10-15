---
name: review-pr
description: Use when Juan wants to review a pull request from Flor or Jesi. Compares it with the approved plan and drafts review comments.
---

# Review pull request

## Purpose

Help Juan review a pull request against its approved plan and draft clear
comments. The conversation with Juan is technical. Comments are posted in
English (repository rule); Flor and Jesi read them through address-review, so
each one must say concretely what to change and why.

## Steps

1. Read the pull request:

   ```
   gh pr view <number> --json number,title,body,headRefName,files,commits
   gh pr diff <number>
   gh pr checks <number>
   ```

2. Read the plan from the branch:

   ```
   git fetch origin
   git ls-tree --name-only origin/<branch> docs/plans/
   git show origin/<branch>:docs/plans/<file>
   ```

3. Confirm the approval with the same rule `implement-ticket` uses: the latest
   move of card `n` into `Approved Plan` was made by `mauriciocuello3`, after
   the last commit that touched the plan. If not, that is a blocking issue.
4. Review:
   - Every plan step is implemented, one commit per step
     (`(step k/N, #n)`), and nothing outside the plan unless it is recorded
     under "Changes after approval".
   - Each behaviour change has a test that checks behaviour.
   - `docs/code-patterns.md` is followed.
   - No real customer data, no `.env`, no secrets; versions stay exact.
   - Nothing in `prisma/` changed: only Juan changes the database.
   - CI is green.
5. Report to Juan: blocking, should fix, and minor issues, each with
   `file:line`.
6. Draft the review in a file (for example `.git/REVIEW.md`): one short
   paragraph per issue saying what to change and why.
7. Post only after Juan's "ok":
   `gh pr review <number> --request-changes --body-file .git/REVIEW.md`
   (or `--comment` / `--approve`).
8. If the same feedback appeared in an earlier review, suggest adding it to
   `docs/code-patterns.md`.

## Never

- Post, approve or merge without Juan's "ok".

## Done when

Juan has posted his review, or decided not to.
