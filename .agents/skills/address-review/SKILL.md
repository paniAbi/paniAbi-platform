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
   gh pr view --json number,url,reviewDecision,reviews,comments
   gh api repos/<owner>/<repo>/pulls/<number>/comments
   ```

   The second command returns comments on specific lines. Take
   `<owner>/<repo>` from `git remote get-url origin`. Only Juan's comments
   count: skip comments from bots (for example `vercel[bot]`), and comments
   already handled by a later `(review, #<n>)` commit or by a reply. Tell the
   person which ones were already done.

2. If the review is approved and only has optional suggestions, nothing has
   to change. Tell them, and offer two options: leave it as it is (the usual
   choice), or apply the suggestion. A new commit after the approval can
   make GitHub ask Juan to approve again, so apply it only if they choose
   to. Juan merges; never merge yourself. When it is merged, use next-step.
3. For each comment, explain in product terms what Juan asks and why it
   matters. Group them: changes requested, questions, suggestions.
4. If a comment changes what the card does, stop: that is a plan change. Use
   plan-ticket (the card goes back to `Planning`). Push only the plan
   change; push no code commits until Mauricio approves the new plan. Let
   Juan know on the review request.
5. For each change: propose it, wait for "ok", apply it, run
   `npx vitest run`, and commit with `fix: <what> (review, #<n>)`.
6. For each question: work out the answer with the person (it may turn into
   a change). Draft a short answer in English and show it with a one-line
   summary in their language. Post it with
   `gh pr comment <number> --body "<answer>"` only after their "ok". For a
   comment on a specific line, quote the file and line in the answer.
7. Run `node scripts/check.mjs`.
8. Send the new commits:

   ```
   node scripts/git-open-pr.mjs
   ```

   It pushes and says the review request already exists.

9. Tell Juan it is ready for another look: draft a short English comment
   listing what changed, show it with a summary in their language, and post
   it after their "ok". The card stays in `To Check`.

## Never

- Dismiss or argue with a comment without the person.
- Post anything on GitHub without their "ok".
- Change things Juan did not ask for.
- Merge the review request, even if the person asks: only Juan merges.

## Done when

Every comment is answered or applied, the checks pass, and the new commits are
on GitHub.
