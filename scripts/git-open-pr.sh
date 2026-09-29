#!/usr/bin/env bash
# Open the pull request for the branch you are working on.
# Usage: ./scripts/git-open-pr.sh ["optional title"]
set -euo pipefail

BASE_BRANCH="main"

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

if [ "$CURRENT_BRANCH" = "$BASE_BRANCH" ]; then
  echo "STOP: you are on '$BASE_BRANCH'. A pull request must come from your own branch."
  echo "Start a ticket first:  ./scripts/git-start-ticket.sh <number> <description>"
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "STOP: you have changes that are not saved in a commit yet."
  echo
  git status --short
  echo
  echo "Commit them first:"
  echo "    git add ."
  echo "    git commit -m \"your message\""
  exit 1
fi

echo "Pushing your branch..."
git push -u origin "$CURRENT_BRANCH"

# Build a default title from the branch name: feat/42-product-list -> "[#42] product list"
TICKET="$(echo "$CURRENT_BRANCH" | sed -n 's#^[a-z]\+/\([0-9]\+\)-.*#\1#p')"
SLUG="$(echo "$CURRENT_BRANCH" | sed -n 's#^[a-z]\+/[0-9]\+-\(.*\)#\1#p' | tr '-' ' ')"
if [ -n "${1:-}" ]; then
  TITLE="$1"
elif [ -n "$TICKET" ]; then
  TITLE="[#${TICKET}] ${SLUG}"
else
  TITLE="$CURRENT_BRANCH"
fi

REMOTE_URL="$(git remote get-url origin)"
REPO_PATH="$(echo "$REMOTE_URL" | sed -e 's#^git@github.com:##' -e 's#^https://github.com/##' -e 's#\.git$##')"
if [[ "$REPO_PATH" =~ ^[A-Za-z0-9._-]+/[A-Za-z0-9._-]+$ ]]; then
  COMPARE_URL="https://github.com/${REPO_PATH}/compare/${BASE_BRANCH}...${CURRENT_BRANCH}?expand=1"
else
  COMPARE_URL=""
fi

if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  echo "Creating the pull request..."
  gh pr create --base "$BASE_BRANCH" --head "$CURRENT_BRANCH" --title "$TITLE" --body-file .github/pull_request_template.md 2>/dev/null \
    || gh pr create --base "$BASE_BRANCH" --head "$CURRENT_BRANCH" --title "$TITLE" --fill
  gh pr view --web >/dev/null 2>&1 || true
  echo "Done. Ask Juan for a review."
else
  echo
  echo "Your branch is on GitHub, but the 'gh' command is not available here."
  if [ -n "$COMPARE_URL" ]; then
    echo "Open the pull request in your browser with this link:"
    echo
    echo "    $COMPARE_URL"
  else
    echo "Open the repository on GitHub and create the pull request from branch:"
    echo
    echo "    $CURRENT_BRANCH"
  fi
  echo
  echo "Suggested title:  $TITLE"
fi
