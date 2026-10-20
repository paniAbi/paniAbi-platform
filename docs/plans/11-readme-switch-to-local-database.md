# [#11] README: switch to the local database if you already had the app

Trello card: https://trello.com/c/pvR050kd/11-readme-pasar-a-la-base-local-si-ten%C3%ADas-el-proyecto-instalado

## 1. What changes for Abril

- **Today:** #8 moved everyone to a local Docker database, but the README
  only explains a setup from scratch. Flor and Jesi already have the app
  installed with a `.env` that points at the live site's database, so their
  testing can still change Abril's live data.
- **After this card:** the README has a short section for people who already
  had the app running, and `AGENTS.md` tells Codex what to do when `.env`
  still points at Neon. Flor and Jesi move to their own local database in
  five steps. Nothing changes on the live site.
- **How we will know it works:**
  - [ ] Following only the new README section on a computer that had the old
        `.env`, `npm run dev` shows the sample products from the local
        database.
  - [ ] Asked "help me run the app", Codex notices a Neon `.env` and asks the
        person to copy the example instead of editing `.env` itself.
- **Out of scope:** any change to scripts, `docker-compose.yml`, CI or
  Vercel.
- **Open questions for Abril:** none (no product behaviour changes).

## 2. How we will build it

- **Files:**
  - `README.md`: new subsection at the end of section 2, "Already had the app
    running before the local database?": open Docker Desktop (install it from
    section 1 if needed), `git switch main` + `npm run git:sync`,
    `cp .env.example .env` (run by the person; it replaces the old URLs),
    `npm run db:local`, `npm run dev`. Explain that after this, nothing
    created locally reaches the live site.
  - `AGENTS.md`, "Databases: only Juan changes them": if `.env` points at
    Neon (or `db:local` says "does not point at this computer"), tell the
    person and ask them to run `cp .env.example .env` themselves; agents never
    edit `.env`.
- **Database change:** no.
- **Steps:**
  1. Documentation only, one commit. Check: `npm run lint` (includes the
     skill check) and `npm run check` pass.
- **Risks / what the reviewer should look at:** `cp .env.example .env`
  overwrites the old `.env`. That is intended: the old URLs pointed at the
  live site and are no longer needed by Flor and Jesi.

## 3. Changes after approval
