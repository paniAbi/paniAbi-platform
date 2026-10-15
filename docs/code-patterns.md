# Code patterns

Read this before planning or implementing a card. The planning, implementing
and reviewing skills all use it, so the person writing the code, Mauricio
approving the plan and Juan reviewing the pull request judge the work against
the same rules.

Juan maintains this file. When the same review comment appears twice, add it
here.

The products feature (`src/app/products/`) is the reference example.

## Feature slice

Each feature lives in a few files named after it:

| File                           | Responsibility                                       | Example                                |
| ------------------------------ | ---------------------------------------------------- | -------------------------------------- |
| `src/app/<feature>/page.tsx`   | Server component: reads data with Prisma and renders | `src/app/products/page.tsx`            |
| `src/app/<feature>/actions.ts` | Server actions: validate and write data              | `src/app/products/actions.ts`          |
| `src/components/<feature>/`    | Client components: forms and lists                   | `product-form.tsx`, `product-list.tsx` |
| `src/lib/<feature>-schema.ts`  | Zod schema shared by the form and the server action  | `src/lib/product-schema.ts`            |

## Validation

- One Zod schema per form, in `src/lib/<feature>-schema.ts`, exporting the
  schema and its inferred type (`ProductFormValues`).
- The form uses it through `zodResolver` (React Hook Form).
- The server action validates again with `safeParse`. Never trust the browser.
- Error messages are full sentences Abril can act on: "Enter a product name."

## Server actions

- The file starts with `"use server"`.
- Return `{ success: true } | { success: false; message: string }`. Do not
  throw errors to the UI.
- Call `revalidatePath("/<feature>")` after writing.

## Data

- Use Prisma only through `@/lib/prisma` (one shared client).
- Store money as integer cents (`priceCents`). Convert at the boundary with
  `Math.round(pesos * 100)` and display with `src/lib/format-money.ts`.
- Pages that read the database export `const dynamic = "force-dynamic"`.
- Only Juan changes the database: `prisma/schema.prisma`, `prisma/migrations/`
  and `prisma/seed.ts`. If a card needs a new field, table or sample data, ask
  Juan before planning it; he adds it first in his own pull request. See
  "Databases: only Juan changes them" in `AGENTS.md`.

## UI

- Use the components in `src/components/ui/` (shadcn) before writing new ones.
- Every input has a `Label` with `htmlFor`; errors appear under the field and
  are linked with `aria-describedby`; results are announced with
  `aria-live="polite"`.

## Tests

- Tests live next to the file they test: `*.test.ts` or `*.test.tsx`
  (Vitest and Testing Library).
- Test behaviour as Abril would see it (what appears, what is rejected), not
  implementation details.
- Every behaviour change gets a test, written before the change.

## Recipe: add a new screen

1. If new data is needed: ask Juan first. Continue once his pull request with
   the new field or table is merged.
2. If the screen saves data: the schema in `src/lib/<feature>-schema.ts`, with
   a test for what it rejects.
3. The server action in `src/app/<feature>/actions.ts`.
4. The form and list components in `src/components/<feature>/`, with tests.
5. The page in `src/app/<feature>/page.tsx`.

## Open decisions

- Colours are hard-coded hex values in `src/app/products/page.tsx`. Before
  more screens copy them, they should move to theme tokens in
  `src/app/globals.css`.
- The interface text is in English. Confirm with Abril which language the
  screens should use.
