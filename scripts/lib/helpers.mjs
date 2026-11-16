// Pure helpers used by the Git scripts. They never run Git, so they are easy
// to test (see helpers.test.mjs).

const MAX_SLUG_LENGTH = 40;

// "Envío de pedidos!" -> "envio-de-pedidos"
export function slugify(description) {
  return description
    .normalize("NFD")
    .replace(/[\u0300-\u036F]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-+$/, "");
}

// ("42", "product list") -> "feat/42-product-list"
export function branchName(ticket, description) {
  if (!/^\d+$/.test(ticket)) {
    throw new Error(`the ticket must be a number. You wrote: '${ticket}'`);
  }
  const slug = slugify(description);
  if (!slug) {
    throw new Error("the description must contain letters or numbers.");
  }
  return `feat/${ticket}-${slug}`;
}

// "feat/42-product-list" -> { ticket: "42", slug: "product-list" }
export function parseBranch(branch) {
  const match = /^[a-z]+\/(\d+)-(.+)$/.exec(branch);
  return match ? { ticket: match[1], slug: match[2] } : null;
}

// "feat/42-product-list" -> "[#42] product list"
export function prTitle(branch, customTitle) {
  if (customTitle) return customTitle;
  const parsed = parseBranch(branch);
  return parsed
    ? `[#${parsed.ticket}] ${parsed.slug.replaceAll("-", " ")}`
    : branch;
}

// ("3", ["3-skills.md", ...]) -> "3-skills.md"
export function findPlanFile(ticket, fileNames) {
  return (
    fileNames.find(
      (name) => name.startsWith(`${ticket}-`) && name.endsWith(".md"),
    ) ?? null
  );
}

// "git@github.com:owner/repo.git" -> "owner/repo"
// Also accepts SSH host aliases such as "git@github-work:owner/repo.git"
// and the "ssh://git@github.com/owner/repo.git" form.
export function repoPathFromRemote(remoteUrl) {
  const match =
    /^(?:git@[^:]+:|ssh:\/\/git@github\.com\/|https:\/\/github\.com\/)([\w.-]+\/[\w.-]+?)(?:\.git)?$/.exec(
      remoteUrl,
    );
  return match ? match[1] : null;
}

// ["--draft", "--body-file", "a.md", "My", "title"]
//   -> { bodyFile: "a.md", draft: true, title: "My title" }
export function parseOpenPrArguments(args) {
  let bodyFile = null;
  let draft = false;
  const titleWords = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--draft") {
      draft = true;
    } else if (args[index] === "--body-file") {
      bodyFile = args[index + 1];
      if (!bodyFile) throw new Error("--body-file needs a file name.");
      index += 1;
    } else {
      titleWords.push(args[index]);
    }
  }
  return { bodyFile, draft, title: titleWords.join(" ") || null };
}

// Vercel sets VERCEL_ENV to "production", "preview" or "development".
// Each of the first two has its own Neon branch, so both can migrate.
// Anywhere else (your computer, CI) the build never migrates.
// "preview" -> true, undefined -> false
export function shouldMigrate(vercelEnv) {
  return vercelEnv === "production" || vercelEnv === "preview";
}

// True only for a database on this computer (the Docker one from
// docker-compose.yml), so local-only commands never reach Neon.
// "postgresql://u:p@localhost:5432/db" -> true, a neon.tech URL -> false
export function isLocalDatabaseUrl(url) {
  try {
    return ["localhost", "127.0.0.1", "[::1]"].includes(new URL(url).hostname);
  } catch {
    return false;
  }
}

// The check shared by every command that may only touch the local database
// (db:local, db:migrate). Returns the lines to show when it must stop, or
// null when .env exists and both URLs point at this computer.
// { envFileExists: true, env: { DATABASE_URL: <neon> } } -> ["STOP: ...", ...]
export function localDatabaseProblem({ envFileExists, env }) {
  if (!envFileExists) {
    return [
      "STOP: there is no .env file.",
      "Create it from the example, then run this again:",
      "    cp .env.example .env",
    ];
  }
  for (const name of ["DATABASE_URL", "DIRECT_URL"]) {
    if (!isLocalDatabaseUrl(env[name])) {
      return [
        `STOP: ${name} in .env does not point at this computer.`,
        "This command only works with the local Docker database, so it never",
        "changes the live site. Copy the local URLs from .env.example.",
      ];
    }
  }
  return null;
}

// Arguments for running Prisma's own entry point with node, without a
// shell, so the options (for example the migration name) arrive exactly as
// typed. ["--name", "x"] -> [".../prisma/build/index.js", "migrate", "dev", "--name", "x"]
export function migrateDevArguments(options) {
  return ["node_modules/prisma/build/index.js", "migrate", "dev", ...options];
}
