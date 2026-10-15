---
name: sync-branch
description: Use when the person wants the latest changes from main, comes back after a break, GitHub says the review request has conflicts, or a push is rejected because the branch is behind. Do not use to start a new card (use start-ticket).
---

# Sync branch

## Purpose

Bring the latest changes from `main` into the person's working copy and handle
conflicts safely.

## Before you start

`git status --short` must be empty. If it is not, explain that there are
unsaved changes. If they belong to the current plan step, offer to save them
as a step first (implement-ticket); otherwise ask what they are.

## Steps

1. Run:

   ```
   node scripts/git-sync.mjs
   ```

2. If it says `Done`: tell them their working copy now has everyone's latest
   changes. Run `npx vitest run` to confirm nothing broke.
3. If it lists conflicted files:
   1. Explain: "You and someone else changed the same part of <file>. Let's
      decide together which version stays."
   2. For each file, read both versions between `<<<<<<<`, `=======` and
      `>>>>>>>`. Explain each side in product terms, for example "your version
      shows the price with two decimals; the other one adds a stock column".
   3. Propose a resolution (often: keep both). Wait for "ok".
   4. Edit the file, remove every marker, then run `git add <file>`.
   5. When every file is resolved, run `git commit --no-edit`.
   6. Use check-work.
4. If the conflict is in files they did not change, in `package-lock.json` or
   `prisma/`, or you are not sure: run `git merge --abort` (it puts
   everything back as it was) and use ask-for-help (Juan).

## Never

- Resolve a conflict without the person's "ok".
- Keep one side of a whole file without reading both.
- Use `git rebase`, `git reset --hard` or `git push --force`.

## Done when

The merge is finished and the tests pass, or the merge was undone and Juan has
been asked.
