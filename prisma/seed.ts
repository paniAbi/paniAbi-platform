import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";
import { normalizeCategoryName } from "../src/lib/category-schema";

const prisma = new PrismaClient();

const categories = ["Budines", "Postres", "Tortas"];

const products = [
  { name: "Lemon Poppy Loaf", priceCents: 680000, categoryName: "Budines" },
  { name: "Dark Chocolate Tart", priceCents: 920000, categoryName: "Postres" },
  { name: "Vanilla Bean Scone", priceCents: 380000, categoryName: null },
  {
    name: "Raspberry Almond Cake",
    priceCents: 1250000,
    categoryName: "Tortas",
  },
  { name: "Cinnamon Morning Bun", priceCents: 420000, categoryName: "Budines" },
  {
    name: "Salted Caramel Brownie",
    priceCents: 510000,
    categoryName: "Postres",
  },
  { name: "Olive Oil Orange Cake", priceCents: 840000, categoryName: "Tortas" },
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
  const categoryIds = new Map<string, string>();

  for (const categoryName of categories) {
    const normalizedName = normalizeCategoryName(categoryName);
    const savedCategory = await prisma.category.upsert({
      where: { normalizedName },
      update: { name: categoryName },
      create: { name: categoryName, normalizedName },
    });
    categoryIds.set(categoryName, savedCategory.id);
  }

  for (const product of products) {
    const { categoryName, ...productData } = product;
    const categoryId = categoryName ? categoryIds.get(categoryName) : null;

    await prisma.product.upsert({
      where: { name: productData.name },
      update: {
        priceCents: productData.priceCents,
        isActive: true,
        categoryId,
      },
      create: { ...productData, categoryId },
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
