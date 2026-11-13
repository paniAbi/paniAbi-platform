import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { name: "Budines", normalizedName: "budines" },
  { name: "Postres", normalizedName: "postres" },
  { name: "Tortas", normalizedName: "tortas" },
];

const products = [
  { name: "Lemon Poppy Loaf", priceCents: 680000, categoryName: "Budines" },
  { name: "Dark Chocolate Tart", priceCents: 920000, categoryName: "Postres" },
  { name: "Vanilla Bean Scone", priceCents: 380000, categoryName: null },
  { name: "Raspberry Almond Cake", priceCents: 1250000, categoryName: "Tortas" },
  { name: "Cinnamon Morning Bun", priceCents: 420000, categoryName: "Budines" },
  { name: "Salted Caramel Brownie", priceCents: 510000, categoryName: "Postres" },
  { name: "Olive Oil Orange Cake", priceCents: 840000, categoryName: "Tortas" },
];

async function main() {
  const categoryIds = new Map<string, string>();

  for (const category of categories) {
    const savedCategory = await prisma.category.upsert({
      where: { normalizedName: category.normalizedName },
      update: { name: category.name },
      create: category,
    });
    categoryIds.set(category.name, savedCategory.id);
  }

  for (const product of products) {
    const { categoryName, ...productData } = product;
    const categoryId = categoryName
      ? categoryIds.get(categoryName)
      : null;

    await prisma.product.upsert({
      where: { name: productData.name },
      update: { priceCents: productData.priceCents, isActive: true, categoryId },
      create: { ...productData, categoryId },
    });
  }
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
