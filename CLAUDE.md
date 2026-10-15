@AGENTS.md

# Claude Code

## Who uses Claude Code

Juan (infrastructure, reviews every pull request) and Mauricio (manager,
approves plans). Both are technical: the "Talking with Flor and Jesi" rules in
`AGENTS.md` do not apply to the conversation.

Exception: anything Flor or Jesi will read — pull request review comments,
Trello comments, plan feedback — must follow those rules.

## Git workflow

- Never push directly to `main`.
- Start a ticket branch with
  `node scripts/ticket-start.mjs <ticket-number> <short-description>`.
- Get Mauricio's plan approval before implementing application changes.
- Synchronise with `node scripts/git-sync.mjs` and open pull requests with
  `node scripts/git-open-pr.mjs`.
- Do not push a feature branch or create a commit unless the user asks you to;
  the start-ticket script itself pushes the branch it creates.
- Juan reviews every pull request. Do not bypass review or CI.

Before finishing code changes, run `node scripts/check.mjs` and report the
PASS/FAIL summary it prints. Never expose, commit, or replace private `.env`
credentials.
