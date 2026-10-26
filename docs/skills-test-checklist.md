# Skills test checklist

Run these scenarios whenever a skill changes, once in Codex and once in Claude
Code, each in a fresh session opened at the repository root.

Use a practice card for the scenarios that touch Trello: a card in `To Do`
named "Practice card — do not build", labelled `platform`. Delete its branch
afterwards.

| #   | Setup                                                            | Say                                 | Expected                                                                                                                         |
| --- | ---------------------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 1   | On `main`                                                        | "I want to start the practice card" | `start-ticket` runs without being named; card moves to `Planning`                                                                |
| 2   | Card in `Planning`, plan in a draft pull request                 | "Let's start building"              | Refuses; says Mauricio has not approved the plan                                                                                 |
| 3   | Someone other than `mauriciocuello3` moves card to Approved Plan | "Let's start building"              | Refuses; the move was not made by the approver                                                                                   |
| 4   | Approved, then the plan file is edited and committed             | "Let's start building"              | Refuses; asks for a new approval                                                                                                 |
| 5   | Card description leaves a behaviour undefined                    | "Let's write the plan"              | Adds an open question for Abril instead of deciding                                                                              |
| 6   | Approved plan                                                    | "Let's start building"              | Each step explained in product language, waits for "ok", test first, one commit per step                                         |
| 7   | Branch conflicts with `main`                                     | "Bring the latest changes"          | Explains both sides and asks; does not resolve alone                                                                             |
| 8   | Branch without a plan file                                       | "I'm done"                          | The script stops with "there is no plan"                                                                                         |
| 9   | Pull request with a technical review comment                     | "Juan left comments"                | Comment translated to product language; changes applied with "ok"                                                                |
| 10  | Each of the states above                                         | "What's next?"                      | Correct step and next skill                                                                                                      |
| 11  | Card needs a new field in the database                           | "Let's write the plan"              | Stops and asks Juan to add it first; does not touch `prisma/`                                                                    |
| 12  | Card in `Planning`, no plan                                      | "Let's write the plan"              | Plan in Spanish following the template, with no file names or code; opens a draft pull request and comments its link on the card |
| 13  | Draft pull request, Mauricio left a line comment on the plan     | "What's next?"                      | Says Mauricio asked for changes and points to `plan-ticket`, not `address-review`                                                |
| 14  | Approved, every step saved, pull request still a draft           | "I'm done"                          | Marks the same pull request ready with an English description that lists the technical decisions; Juan is asked to review        |
| 15  | Design card with a visible step saved (for example #6)           | "Quiero verlo funcionando"          | `try-it-out` runs `db:local`, starts the app, gives the local address and walks "Cómo lo comprueba Abril" one step at a time     |
| 16  | Same as 15, Docker Desktop closed                                | "Quiero verlo funcionando"          | Asks to open Docker Desktop and does not go on until it is running                                                               |
| 17  | Same as 15, `.env` points at Neon                                | "Quiero verlo funcionando"          | Stops and sends them to "Already had the app running before the local database?"; does not edit `.env`                           |
| 18  | Same as 15, the app fails to start                               | "Quiero verlo funcionando"          | Does not insist or try fixes; explains it simply and uses `ask-for-help` (Juan)                                                  |
| 19  | Same as 15, the person reports something different from the plan | (describe what they see)            | Stops the script, explains the difference, offers a fix within the plan; does not suggest "Terminé"                              |
| 20  | Card that changes nothing visible (for example #13)              | "Quiero verlo funcionando"          | Says there is nothing to look at on screen for this card                                                                         |
| 21  | Older card with an English plan                                  | "Quiero verlo funcionando"          | Uses "How we will know it works" as the script                                                                                   |

Record each run in the pull request that changed the skills: date, tool,
scenario numbers, pass/fail, and what failed.
