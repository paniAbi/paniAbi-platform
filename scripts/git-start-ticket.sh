#!/usr/bin/env bash
# Start working on a ticket: creates your branch from an up-to-date main.
# Usage:  ./scripts/git-start-ticket.sh <ticket-number> <short description>
# Example: ./scripts/git-start-ticket.sh 42 product list page
set -euo pipefail

BASE_BRANCH="main"
PREFIX="feat"

if [ "$#" -lt 2 ]; then
  echo "Usage: ./scripts/git-start-ticket.sh <ticket-number> <short description>"
  echo "Example: ./scripts/git-start-ticket.sh 42 product list page"
  exit 1
fi

TICKET="$1"; shift
DESCRIPTION="$*"

if ! [[ "$TICKET" =~ ^[0-9]+$ ]]; then
  echo "ERROR: the ticket must be a number. You wrote: '$TICKET'"
  exit 1
fi

# lowercase, non-alphanumeric to dashes, trim dashes, max 40 chars
SLUG="$(echo "$DESCRIPTION" \
  | tr '[:upper:]' '[:lower:]' \
  | sed 's/[^a-z0-9]\+/-/g; s/^-\+//; s/-\+$//' \
  | cut -c1-40 | sed 's/-\+$//')"

if [ -z "$SLUG" ]; then
  echo "ERROR: the description must contain letters or numbers."
  exit 1
fi

BRANCH="${PREFIX}/${TICKET}-${SLUG}"

if [ -n "$(git status --porcelain)" ]; then
  echo "STOP: you have changes that are not saved in a commit yet."
  echo
  git status --short
  echo
  echo "Commit or discard them before starting a new ticket."
  exit 1
fi

if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  echo "That branch already exists. Switching to it:"
  git switch "$BRANCH"
  exit 0
fi

echo "Updating $BASE_BRANCH..."
git switch "$BASE_BRANCH"
git pull --ff-only origin "$BASE_BRANCH"

echo "Creating branch: $BRANCH"
git switch -c "$BRANCH"
git push -u origin "$BRANCH"

echo
echo "Ready. You are now on '$BRANCH'."
echo "Write your plan, get it approved, and then start working."
