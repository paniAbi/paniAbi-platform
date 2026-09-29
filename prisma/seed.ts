import { PrismaClient } from "@prisma/client";

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

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: { priceCents: product.priceCents, isActive: true },
      create: product,
    });
  }
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
