// Create Abril's account, or reset its password, in the database that
// DATABASE_URL points at. The password is typed in the terminal (hidden),
// stored only as a scrypt hash, and never written to any file. Resetting it
// logs her out on every device.
//
// Usage: npm run admin:password -- <username>
// For the live site, export the production Neon URLs in the terminal for
// this one command (they win over .env); the script shows which database it
// will change and asks for confirmation first.
import { existsSync } from "node:fs";
import process from "node:process";
import { createInterface } from "node:readline/promises";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";
import { newPasswordProblem } from "../src/lib/auth/new-password";

function stop(message: string): never {
  console.error(message);
  process.exit(1);
}

// Reads one line without echoing it, for the password.
function askHidden(question: string): Promise<string> {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    process.stdout.write(question);
    stdin.setRawMode?.(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    let answer = "";
    const onData = (key: string) => {
      for (const char of key) {
        if (char === "\u0003") stop("\nCancelled."); // Ctrl+C
        if (char === "\r" || char === "\n") {
          stdin.setRawMode?.(false);
          stdin.pause();
          stdin.off("data", onData);
          process.stdout.write("\n");
          resolve(answer);
          return;
        }
        if (char === "\u007f" || char === "\b") answer = answer.slice(0, -1);
        else answer += char;
      }
    };
    stdin.on("data", onData);
  });
}

async function main() {
  const username = process.argv[2]?.trim();
  if (!username) stop("Usage: npm run admin:password -- <username>");

  if (existsSync(".env")) process.loadEnvFile(".env");
  let host: string;
  try {
    host = new URL(process.env.DATABASE_URL ?? "").hostname;
  } catch {
    stop("STOP: DATABASE_URL is missing or is not a URL.");
  }

  const lines = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const confirmation = await lines.question(
    `This changes the account "${username}" in the database at ${host}.\n` +
      `Type the host name to continue: `,
  );
  lines.close();
  if (confirmation.trim() !== host) stop("Cancelled: nothing was changed.");

  const password = await askHidden("New password (hidden): ");
  const repeated = await askHidden("Type it again: ");
  const problem = newPasswordProblem(password, repeated);
  if (problem) stop(`${problem} Nothing was changed.`);

  const prisma = new PrismaClient();
  try {
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.upsert({
      where: { username },
      update: { passwordHash },
      create: { username, passwordHash },
    });
    const { count } = await prisma.session.deleteMany({
      where: { userId: user.id },
    });
    console.log(
      `Done: "${username}" can log in with the new password. ` +
        `${count} open session(s) were closed.`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().then(
  // Reading the password leaves stdin open, which would keep the process
  // waiting after it finished.
  () => process.exit(0),
  (error: unknown) => {
    console.error(error);
    process.exit(1);
  },
);
