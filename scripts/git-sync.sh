#!/usr/bin/env bash
# Bring the latest changes from main into your current branch.
# Run this before you start working, and again if your PR shows conflicts.
set -euo pipefail

BASE_BRANCH="main"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "ERROR: you are not inside the project folder."
  echo "Open a terminal inside the repository and try again."
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "STOP: you have changes that are not saved in a commit yet."
  echo
  git status --short
  echo
  echo "Commit them first, then run this script again:"
  echo "    git add ."
  echo "    git commit -m \"your message\""
  exit 1
fi

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
echo "Fetching the latest changes..."
git fetch origin --prune

if [ "$CURRENT_BRANCH" = "$BASE_BRANCH" ]; then
  git pull --ff-only origin "$BASE_BRANCH"
  echo "Done. Your $BASE_BRANCH is up to date."
  exit 0
fi

echo "Bringing '$BASE_BRANCH' into your branch '$CURRENT_BRANCH'..."
if git merge --no-edit "origin/$BASE_BRANCH"; then
  echo "Done. Your branch now includes everything from $BASE_BRANCH."
else
  echo
  echo "There is a conflict: the same lines were changed in two places."
  echo "Git needs you to choose which version stays."
  echo
  echo "Files to fix:"
  git diff --name-only --diff-filter=U | sed 's/^/    /'
  echo
  echo "Open each file, keep the correct version, remove the <<<< ==== >>>> markers, then run:"
  echo "    git add ."
  echo "    git commit"
  echo
  echo "If you get stuck, ask Juan before doing anything else."
  exit 1
fi
