# [#12] Plans in Spanish, product-only, reviewed in a draft pull request

Trello card: https://trello.com/c/BZhMKIwV

## 1. What changes for Abril

- **Today:** plans are written in English, and part 2 ("How we will build
  it") lists files and code decisions. Flor and Jesi cannot contribute to
  half of their own plan (see the plan of #10). Mauricio reviews the plan
  from a Trello comment with a link, away from the text, and cannot comment
  on a specific line.
- **After this card:**
  - Plans are written in Spanish and entirely from the product side: what
    changes for Abril and why, expected behaviour with concrete examples,
    what changes compared with today, what will be tested (in words), how
    Abril checks it, steps, new data to store, out of scope, business risks
    and open questions for Abril (template in appendix A, worked example for
    #10 in appendix B).
  - Technical decisions (files, functions, libraries within the plan) are
    made by the agent while building, following `docs/code-patterns.md`.
    Juan reviews them in the pull request, and `open-pr` lists them in
    "Notes for the reviewer".
  - When the plan is ready, `plan-ticket` opens a **draft pull request**
    with it. Mauricio comments on plan lines there, in Spanish product
    language. The Trello comment links the pull request.
  - The same pull request later receives the step commits. `open-pr` marks
    it ready for review and updates its description, so Juan gets one pull
    request per card with the plan discussion and the code together.
  - Approval does not change: Mauricio moves the card to `Approved Plan`,
    and the plan must not change after that move. A GitHub "Approve" from
    Mauricio does not count.
- **How we will know it works:**
  - [ ] In a dry run on the practice card (#7), "let's write the plan"
        produces a plan in Spanish that follows appendix A, with no file
        names or code, and opens a draft pull request linked from the card.
  - [ ] `review-plan` posts Mauricio's comments on plan lines in that pull
        request, in Spanish.
  - [ ] "What's next?" on a card whose draft pull request waits for
        Mauricio says it is waiting for Mauricio, not for Juan.
  - [ ] After approval and building, "I'm done" turns the same pull request
        into ready for review with an English description, and Juan is
        asked to review it.
  - [ ] `node scripts/check.mjs` passes, including new tests for the
        script's argument parsing.
- **Out of scope:**
  - Everything else in the repository stays in English (code, comments,
    commits, pull request titles and descriptions, Juan's review comments).
  - Rewriting existing plans. The plan of #10 is revised by Jesi with
    plan-ticket after this card is merged (see "Transition").
  - Changing how approval is recorded, or GitHub branch rules.
- **Open questions for Abril:** none (no product behaviour changes).

## 2. How we will build it

- **Files:**
  - `scripts/git-open-pr.mjs` and `scripts/lib/helpers.mjs`
    (`parseOpenPrArguments`), with tests in `scripts/lib/helpers.test.mjs`:
    - New `--draft` flag: creates the pull request as a draft
      (`gh pr create --draft`). If it already exists, it only pushes, as
      today.
    - Without `--draft`, when the open pull request is a draft: update its
      description from `--body-file` (`gh pr edit --body-file`), then mark it
      ready (`gh pr ready`). Print that Juan was asked for a review.
    - Without `gh`: the printed compare link stays; with `--draft`, also say
      to pick "Create draft pull request" on GitHub.
  - `docs/plans/_template.md`: replaced by appendix A.
  - `AGENTS.md`:
    - Language rule: plans in `docs/plans/` and Mauricio's plan comments on
      pull requests are written in Spanish; everything else stays in
      English.
    - Trello section: a plan's discussion happens in its draft pull request;
      approval is still the move.
    - "Writing code": the agent makes the technical decisions while
      building, inside what the plan allows (no new dependencies, no
      database changes, nothing outside the steps).
  - `CONTRIBUTING.md`: "Working on a platform ticket" table and "The plan
    checkpoint" describe the draft pull request.
  - Skills (`.agents/skills/*` for the shared ones, `.claude/skills/*` for
    Mauricio's and Juan's; the `.claude` pointers do not change):
    - `plan-ticket`: write each section of appendix A with the person, in
      Spanish and product language only (no file names, functions or code).
      Remove the "Read `docs/code-patterns.md` and the code" planning step
      for technical design; keep reading the code to understand today's
      behaviour. After the person's "ok": commit, push, write a short
      English pull request description to `.git/PR_BODY.md` ("Plan for #<n>, waiting for Mauricio's approval" plus the plan path), run
      `node scripts/git-open-pr.mjs --draft --body-file .git/PR_BODY.md`,
      and comment the pull request link on the card. When revising, read
      Mauricio's comments from the pull request (conversation and line
      comments) as well as Trello. A blocked draft plan is saved without
      opening the pull request, as today.
    - `review-plan`: read the plan from the draft pull request; review it
      against appendix A (concrete examples, edge cases in "Qué vamos a
      probar", no technical content). Post requested changes as pull request
      line comments in Spanish product language, after Mauricio's "ok".
      Approve by moving the card, as today.
    - `implement-ticket`: read the steps from "Pasos"; for each step, decide
      the technical approach following `docs/code-patterns.md` and the
      Next.js guide, and say it in product terms. Turn each case of "Qué
      vamos a probar" into a test. Anything not allowed by the plan is
      still a plan change.
    - `open-pr`: the pull request already exists as a draft. Allow that
      case (the "never as a draft" rule now only forbids marking it ready
      with steps missing). The English description now also lists, under
      "Notes for the reviewer", the technical decisions taken while
      building. The script marks it ready.
    - `next-step`: new rows: draft pull request and card in `Planning`
      means "waiting for Mauricio" (or plan-ticket if he commented after
      the last plan commit); draft pull request and card approved means
      building (implement-ticket). The existing "review request open" rows
      only apply to pull requests that are not drafts.
    - `address-review`: only for Juan's comments on a ready pull request.
      Mauricio's plan comments go to plan-ticket.
    - `review-pr`: skip draft pull requests; the plan is in Spanish and has
      no technical part, so review the technical decisions against
      `docs/code-patterns.md` and "Notes for the reviewer".
  - `docs/skills-test-checklist.md`: update scenarios 1, 2, 5, 8 and 10 for
    the draft pull request, and add a scenario for "plan written in Spanish
    with no technical content".
- **Database change:** no.
- **Steps:**
  1. Test: `parseOpenPrArguments` accepts `--draft` together with
     `--body-file` and a title → Change: `git-open-pr.mjs` creates drafts and
     marks an existing draft ready. Commit:
     `feat: open plan pull requests as drafts (step 1/3, #12)`.
  2. Docs: new template (appendix A), `AGENTS.md` and `CONTRIBUTING.md`.
     Commit: `docs: write plans in Spanish from the product side (step 2/3, #12)`.
  3. Skills and test checklist as listed above. Check: `npm run lint`
     (includes the skill check) and `node scripts/check.mjs`. Commit:
     `docs: review plans in a draft pull request (step 3/3, #12)`.
- **Risks / what the reviewer should look at:**
  - Juan loses the technical plan as a review aid. Mitigation: technical
    decisions are listed in the pull request description, and the plan's
    steps and test cases still bound what can be built.
  - With the plan open as a draft pull request, CI and the Vercel preview
    run on a plan-only branch. Harmless, but they use build minutes.
  - Juan is requested as code owner only when the draft is marked ready;
    until then he may still see it in the pull request list.
  - Mixed languages in one pull request: Spanish plan and plan discussion,
    English code, description and code review.

## Transition

Jesi's #10 has an English plan (not approved yet). After this card is
merged, she runs sync-branch and then plan-ticket ("revise the plan"), which
rewrites it with the new template and opens its draft pull request. Flor's
#9 is still in `To Do`, so it starts directly with the new flow.

## Appendix A: new `docs/plans/_template.md`

```markdown
# [#<número de tarjeta>] <título de la tarjeta>

Tarjeta de Trello: <link de la tarjeta>

<!-- Todo el plan va en español y en lenguaje de producto: sin nombres de
     archivos, funciones ni código. Las decisiones técnicas se toman al
     construir y Juan las revisa en el pedido de revisión. -->

## 1. Qué cambia para Abril

- **Hoy:**
- **Después de esta tarjeta:**
- **Por qué le importa a la panadería:**

## 2. Comportamiento esperado

<!-- Ejemplos concretos, uno por fila: "cuando pasa esto, Abril ve esto". -->

| Situación | Qué ve o puede hacer Abril |
| --------- | -------------------------- |
|           |                            |

## 3. Qué cambia respecto de hoy

<!-- Lo que hoy funciona de una forma y después de otra. Si solo se agrega
     algo nuevo: "Nada: solo se agrega …". -->

## 4. Qué vamos a probar

<!-- En palabras. Cada caso se convierte en un chequeo automático. Incluí los
     casos raros y lo que NO tiene que cambiar. -->

- [ ]

## 5. Cómo lo comprueba Abril

<!-- Qué página abrir, qué hacer y qué tiene que ver. Solo datos inventados. -->

1.

## 6. Pasos

<!-- Cada paso es una oración de producto y se guarda como un paso propio.
     Una tarjeta chica tiene un solo paso. Más de seis pasos: conviene
     dividir la tarjeta. -->

1.

## 7. Información nueva para guardar

<!-- ¿Hace falta guardar algo que hoy no se guarda (un dato nuevo de los
     productos, una lista nueva)? Si es así, Juan lo agrega primero en su
     propio pedido de revisión: enlazalo acá. -->

No.

## 8. Fuera de esta tarjeta

## 9. Riesgos para el negocio

<!-- Qué podría salir mal para Abril o sus clientes, y qué mirar con más
     cuidado al revisar. -->

## 10. Preguntas abiertas para Abril

<!-- Tiene que estar vacío antes de pedir la aprobación de Mauricio. -->

## 11. Cambios después de la aprobación

<!-- Cualquier cambio acá vuelve la tarjeta a Planning para una nueva
     aprobación. Una línea con fecha por cambio: qué cambió y por qué. -->
```

## Appendix B: the plan of #10 in the new template (example)

```markdown
# [#10] Mostrar los precios sin ",00" cuando no tienen centavos

Tarjeta de Trello: https://trello.com/c/nBy4rWGp

## 1. Qué cambia para Abril

- **Hoy:** en la página de productos todos los precios se ven con centavos,
  aunque sean redondos: "$ 800,00".
- **Después de esta tarjeta:** los precios redondos se ven sin ",00"
  ("$ 800"). Los que tienen centavos se ven como hoy.
- **Por qué le importa a la panadería:** la lista es más fácil de leer para
  Abril y para quien mire los precios.

## 2. Comportamiento esperado

| Situación                    | Qué ve Abril |
| ---------------------------- | ------------ |
| Un producto de 800 pesos     | "$ 800"      |
| Un producto de 1500 pesos    | "$ 1.500"    |
| Un producto de 1250,50 pesos | "$ 1.250,50" |
| Un producto de 1250,05 pesos | "$ 1.250,05" |

## 3. Qué cambia respecto de hoy

Solo cómo se muestran los precios redondos. Los precios guardados no cambian.

## 4. Qué vamos a probar

- [ ] Un precio redondo se muestra sin ",00".
- [ ] Un precio con centavos muestra siempre dos cifras ("50", no "5").
- [ ] Un precio con pocos centavos conserva el cero ("05").
- [ ] Los miles siguen separados con punto.
- [ ] El signo "$" sigue apareciendo igual que hoy.

## 5. Cómo lo comprueba Abril

1. Abrir la página de productos.
2. Ver que un producto de precio redondo no muestra ",00" y uno con
   centavos sí los muestra.

## 6. Pasos

1. Los precios redondos se ven sin ",00" en la lista de productos.

## 7. Información nueva para guardar

No.

## 8. Fuera de esta tarjeta

Cómo se carga el precio en el formulario para agregar productos.

## 9. Riesgos para el negocio

Si el cambio sale mal, un precio podría verse distinto de lo que cuesta
(por ejemplo "$ 1.250,5"). Por eso se prueban los centavos que terminan en
cero.

## 10. Preguntas abiertas para Abril

Ninguna.

## 11. Cambios después de la aprobación
```

## 3. Changes after approval
