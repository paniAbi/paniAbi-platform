import { sortCategoriesByName } from "@/lib/category-order";
import { formatPesos } from "@/lib/format-money";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = { title: "paniAbi" };

// Only what customers may see.
const visibleProduct = {
  orderBy: { name: "asc" },
  select: { id: true, name: true, priceCents: true },
} as const;

// The public view for customers: read-only, no login. A minimal list for now;
// the full catalogue design is a separate card.
export default async function HomePage() {
  const [categories, uncategorizedProducts] = await Promise.all([
    prisma.category.findMany({
      select: {
        id: true,
        name: true,
        products: { where: { isActive: true }, ...visibleProduct },
      },
    }),
    prisma.product.findMany({
      where: { isActive: true, categoryId: null },
      ...visibleProduct,
    }),
  ]);

  const groups = [
    ...sortCategoriesByName(categories),
    {
      id: "uncategorized",
      name: "Otros productos",
      products: uncategorizedProducts,
    },
  ].filter((group) => group.products.length > 0);

  return (
    <main className="min-h-screen px-4 pb-16 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <header className="border-line border-b py-8">
          <h1 className="font-display text-ink text-3xl sm:text-4xl">
            paniAbi
          </h1>
        </header>

        {groups.length === 0 && (
          <p className="text-quiet py-10">
            Todavía no hay productos para mostrar.
          </p>
        )}

        {groups.map((group) => (
          <section key={group.id} className="pt-8">
            <h2
              id={`group-${group.id}`}
              className="font-display text-ink text-xl"
            >
              {group.name}
            </h2>
            <ul
              aria-labelledby={`group-${group.id}`}
              className="divide-line-row divide-y"
            >
              {group.products.map((product) => (
                <li
                  key={product.id}
                  className="text-ink flex items-baseline justify-between gap-4 py-4"
                >
                  <span className="min-w-0 truncate font-medium">
                    {product.name}
                  </span>
                  <span className="shrink-0 font-medium tabular-nums">
                    {formatPesos(product.priceCents)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
