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

2. If it says `Done`: run `npx vitest run` (not `npm test`, which never
   finishes) to confirm nothing broke. On a `feat/` branch, then run
   `git push` (never on `main`). The push is what makes GitHub see the latest
   changes; until then a review request still shows conflicts. Tell them
   their working copy now has everyone's latest changes.
3. If it lists conflicted files, first look at the whole list. If any file is
   `package-lock.json` or inside `prisma/`, or you are not sure about any of
   them: do not edit anything. Run `git merge --abort` (it puts everything
   back as it was, nothing of theirs is lost), check that
   `git status --short` is empty, and use ask-for-help (Juan). When Juan has
   sorted it out, run this skill again.
   Never leave the merge half done, even if they ask you to fix only some
   files.
4. Otherwise, resolve them with the person:
   1. Explain: "You and someone else changed the same part of <file>. Let's
      decide together which version stays."
   2. For each file, read both versions between `<<<<<<<`, `=======` and
      `>>>>>>>`. Explain each side in product terms, for example "your version
      shows the price with two decimals; the other one adds a stock column".
   3. Propose a resolution (often: keep both) as a yes/no question. Wait for
      "ok". If they say "choose for you", that is an "ok" only for keeping
      both changes. If keeping both is impossible and one change must be
      dropped, that is a product decision: abort and use ask-for-help.
   4. Edit the file and remove every marker. Check that none is left: this
      must print nothing:

      ```
      git grep -n -E "^(<<<<<<<|=======|>>>>>>>)" -- <file>
      ```

      Then run `git add <file>`.

   5. When every file is resolved, run `git commit --no-edit` and
      `npx vitest run`. If the tests pass, run `git push`; if not, use
      check-work before pushing.

## When something goes wrong

| Situation                | What to do                                                              |
| ------------------------ | ----------------------------------------------------------------------- |
| `could not reach GitHub` | Ask them to check their internet connection, then run the script again. |
| `the merge failed`       | Do not try to fix it. Use ask-for-help (Juan).                          |
| `git push` is rejected   | Do not force it. Use ask-for-help (Juan).                               |

## Never

- Resolve a conflict without the person's "ok".
- Keep one side of a whole file without reading both.
- Leave a merge half done, or commit it with a file still in conflict.
- Use `git rebase`, `git reset --hard` or `git push --force`.

## Done when

The merge is finished, pushed to GitHub and the tests pass, or the merge was
undone and Juan has been asked.
