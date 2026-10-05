# Dependency Version Decisions

This document records why Prisma and ESLint are pinned to their current
versions, what can break when they are upgraded, and what to check before
changing either pin. All direct dependencies in `package.json` are exact
versions; do not add a range just to make updates automatic.

## Prisma: 6.12.0

### Why this version is pinned

Prisma `6.12.0` was selected because the later Prisma 6 version inspected while
building this scaffold pulled in a vulnerable `@prisma/config` dependency
through `deepmerge-ts`. `npm audit` reported a high-severity advisory for that
dependency and identified Prisma `6.12.0` as the available non-affected
version. The `6.12.0` Prisma CLI and client work with this project's PostgreSQL
schema, including `directUrl` for Neon migrations, and `npm audit` reported no
vulnerabilities for the resulting lockfile.

The CLI and client must stay on the same exact version:

- `prisma` (development dependency): `6.12.0`
- `@prisma/client` (runtime dependency): `6.12.0`

### What may happen if it is upgraded

- A newer patch or minor release may change generated client behaviour or
  introduce new transitive dependencies and security advisories.
- A major release may change Prisma configuration. For example, a newer major
  can move datasource URLs out of `schema.prisma` into a Prisma config file;
  copying an upgrade example without following the matching guide can break
  `directUrl`, migrations, generation, or CI.
- The CLI and generated client can become incompatible if they are upgraded to
  different versions.
- A schema or migration behaviour change can affect the Neon database. Never
  test a migration against a teammate's shared branch or production data.

### Checks before updating

1. Read the official upgrade guide and release notes for every crossed Prisma
   major version. Check the installed Prisma docs when available.
2. Check advisories for both Prisma packages and their dependency tree with
   `npm audit`; do not assume a newer version is automatically safer.
3. Update `prisma` and `@prisma/client` to the same exact version, then run
   `npm install --save-exact` and review the lockfile changes.
4. Validate and generate the client using placeholder connection URLs:

   ```bash
   DATABASE_URL='postgresql://user:pass@localhost:5432/neondb' DIRECT_URL='postgresql://user:pass@localhost:5432/neondb' npx prisma validate
   DATABASE_URL='postgresql://user:pass@localhost:5432/neondb' DIRECT_URL='postgresql://user:pass@localhost:5432/neondb' npx prisma generate
   ```

5. Test migrations only against your own disposable Neon branch. Confirm the
   pooled URL is used by the application and the direct URL is used for
   migrations.
6. Run `npm run lint`, `npx tsc --noEmit`, `npm run test -- --run`,
   `npm run build`, and `npm audit` before opening a pull request.

## ESLint: 9.39.2

### Why this version is pinned

ESLint `10.11.0` was tested because the current `eslint-config-next` peer range
allows ESLint 10. However, linting failed while loading Next's bundled React
rule with this runtime error:

```text
TypeError: contextOrFilename.getFilename is not a function
```

The bundled `eslint-plugin-react` still uses the ESLint rule context API that
ESLint 10 removed. ESLint `9.39.2` works with the current Next.js 16.3.7 flat
configuration and `npm run lint` passes.

This is a compatibility pin, not a claim that ESLint 9 is current. npm marks
this ESLint version as no longer supported. Remove this pin once the Next.js
configuration and its React plugin work with a supported ESLint release.

### What may happen if it is upgraded

- Upgrading to ESLint 10 with the current bundled React plugin makes
  `npm run lint` fail before it can check project files.
- A future Next.js upgrade can replace or update the bundled plugin and flat
  configuration, but can also change rules or configuration entry points.
- Staying on ESLint 9 means missing future ESLint fixes and support. This pin
  should therefore be reviewed, not treated as a permanent version choice.

### Checks before updating

1. Check the supported ESLint range for the exact `eslint-config-next` version
   and confirm its bundled `eslint-plugin-react` supports that ESLint API.
2. Upgrade ESLint and the Next.js lint configuration together when necessary;
   do not rely on a peer-dependency range alone as proof of runtime
   compatibility.
3. Run `npm run lint` immediately. Confirm the React rules load and lint the
   application and test files, not just the config file.
4. Run `npm run lint`, `npx tsc --noEmit`, `npm run test -- --run`,
   `npm run build`, and `npm audit`; inspect the lockfile and any changed rules.
5. Keep the ESLint pin exact until the chosen combination passes locally and
   in CI.
