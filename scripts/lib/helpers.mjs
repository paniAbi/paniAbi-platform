// Pure helpers used by the Git scripts. They never run Git, so they are easy
// to test (see helpers.test.mjs).

const MAX_SLUG_LENGTH = 40;

// "Envío de pedidos!" -> "envio-de-pedidos"
export function slugify(description) {
  return description
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
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
// Also accepts SSH host aliases such as "git@github-work:owner/repo.git".
export function repoPathFromRemote(remoteUrl) {
  const match =
    /^(?:git@[^:]+:|https:\/\/github\.com\/)([\w.-]+\/[\w.-]+?)(?:\.git)?$/.exec(
      remoteUrl,
    );
  return match ? match[1] : null;
}

// ["--body-file", "a.md", "My", "title"] -> { bodyFile: "a.md", title: "My title" }
export function parseOpenPrArguments(args) {
  let bodyFile = null;
  const titleWords = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--body-file") {
      bodyFile = args[index + 1];
      if (!bodyFile) throw new Error("--body-file needs a file name.");
      index += 1;
    } else {
      titleWords.push(args[index]);
    }
  }
  return { bodyFile, title: titleWords.join(" ") || null };
}
