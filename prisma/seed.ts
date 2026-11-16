import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();

const products = [
  { name: "Lemon Poppy Loaf", priceCents: 680000 },
  { name: "Dark Chocolate Tart", priceCents: 920000 },
  { name: "Vanilla Bean Scone", priceCents: 380000 },
  { name: "Raspberry Almond Cake", priceCents: 1250000 },
  { name: "Cinnamon Morning Bun", priceCents: 420000 },
  { name: "Salted Caramel Brownie", priceCents: 510000 },
  { name: "Olive Oil Orange Cake", priceCents: 840000 },
];

// Invented test account for local databases only. Its password is public
// (README), so it must never exist on Neon: it is skipped unless the database
// is on this computer. Juan creates Abril's real account with
// `npm run admin:password`.
const TEST_ACCOUNT = {
  username: "abril-prueba",
  password: "paniabi-prueba",
};

function isLocalDatabase(url: string | undefined) {
  try {
    return ["localhost", "127.0.0.1", "[::1]"].includes(
      new URL(url ?? "").hostname,
    );
  } catch {
    return false;
  }
}

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: { priceCents: product.priceCents, isActive: true },
      create: product,
    });
  }

  if (isLocalDatabase(process.env.DATABASE_URL)) {
    // Resets the test password on every run, so it always matches the README.
    const passwordHash = await hashPassword(TEST_ACCOUNT.password);
    await prisma.user.upsert({
      where: { username: TEST_ACCOUNT.username },
      update: { passwordHash },
      create: { username: TEST_ACCOUNT.username, passwordHash },
    });
  } else {
    console.log("Skipping the test account: the database is not local.");
  }
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
