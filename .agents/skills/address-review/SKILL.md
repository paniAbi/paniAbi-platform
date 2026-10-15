---
name: address-review
description: Use when Juan left comments or requested changes on the person's review request (pull request), or when they ask what Juan said. Do not use before a review request exists (use open-pr).
---

# Address review

## Purpose

Explain Juan's review in product terms and apply the changes with the
person's agreement.

## Before you start

The branch is `feat/<n>-<description>` and has an open review request:
`gh pr view --json url,state,reviewDecision`. If `gh` is not available, ask
the person to paste Juan's comments.

## Steps

1. Read the comments:

   ```
   gh pr view --json number,url,reviews,comments
   gh api repos/<owner>/<repo>/pulls/<number>/comments
   ```

   The second command returns comments on specific lines. Take
   `<owner>/<repo>` from `git remote get-url origin`.

2. For each comment, explain in product terms what Juan asks and why it
   matters. Group them: changes requested, questions, suggestions.
3. If a comment changes what the card does, stop: that is a plan change. Use
   plan-ticket and let Juan know on the review request.
4. For each change: propose it, wait for "ok", apply it, run
   `npx vitest run`, and commit with `fix: <what> (review, #<n>)`.
5. For each question: draft a short answer in English, show it to the person,
   and post it with `gh pr comment <number> --body "<answer>"` only after
   their "ok". For a comment on a specific line, quote the file and line in
   the answer.
6. Run `node scripts/check.mjs`.
7. Send the new commits:

   ```
   node scripts/git-open-pr.mjs
   ```

   It pushes and says the review request already exists.

8. Tell them Juan can look again. The card stays in `To Check`.

## Never

- Dismiss or argue with a comment without the person.
- Post anything on GitHub without their "ok".
- Change things Juan did not ask for.

## Done when

Every comment is answered or applied, the checks pass, and the new commits are
on GitHub.
