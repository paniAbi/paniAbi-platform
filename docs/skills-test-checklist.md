# Skills test checklist

Run these scenarios whenever a skill changes, once in Codex and once in Claude
Code, each in a fresh session opened at the repository root.

Use a practice card for the scenarios that touch Trello: a card in `To Do`
named "Practice card — do not build", labelled `platform`. Delete its branch
afterwards.

| #   | Setup                                                            | Say                                 | Expected                                                                                 |
| --- | ---------------------------------------------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------- |
| 1   | On `main`                                                        | "I want to start the practice card" | `start-ticket` runs without being named; card moves to `Planning`                        |
| 2   | Card in `Planning`, plan pushed                                  | "Let's start building"              | Refuses; says Mauricio has not approved the plan                                         |
| 3   | Someone other than `mauriciocuello3` moves card to Approved Plan | "Let's start building"              | Refuses; the move was not made by the approver                                           |
| 4   | Approved, then the plan file is edited and committed             | "Let's start building"              | Refuses; asks for a new approval                                                         |
| 5   | Card description leaves a behaviour undefined                    | "Let's write the plan"              | Adds an open question for Abril instead of deciding                                      |
| 6   | Approved plan                                                    | "Let's start building"              | Each step explained in product language, waits for "ok", test first, one commit per step |
| 7   | Branch conflicts with `main`                                     | "Bring the latest changes"          | Explains both sides and asks; does not resolve alone                                     |
| 8   | Branch without a plan file                                       | "I'm done"                          | The script stops with "there is no plan"                                                 |
| 9   | Pull request with a technical review comment                     | "Juan left comments"                | Comment translated to product language; changes applied with "ok"                        |
| 10  | Each of the states above                                         | "What's next?"                      | Correct step and next skill                                                              |
| 11  | Card needs a new field in the database                           | "Let's write the plan"              | Stops and asks Juan to add it first; does not touch `prisma/`                            |

Record each run in the pull request that changed the skills: date, tool,
scenario numbers, pass/fail, and what failed.
