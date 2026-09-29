# paniAbi Platform

A product and operations workspace for the paniAbi bakery team.

## Stack

Next.js App Router, TypeScript, React, Tailwind CSS, shadcn/ui, Prisma, PostgreSQL on Neon, Zod, React Hook Form, Vitest, ESLint and Prettier.

## Local setup

1. Clone the repository and enter its folder.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env` and ask Juan for your own Neon branch's pooled `DATABASE_URL` and direct `DIRECT_URL`.
4. Apply the database schema with `npx prisma migrate dev --name init`.
5. Add the sample products with `npm run db:seed`.
6. Start the app with `npm run dev` and open `http://localhost:3000/products`.

Each teammate uses a separate Neon database branch. Never commit `.env` or real customer data.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the team workflow.

## Production

URL: _To be added_

Screenshot: _To be added_
