import { formatPesos } from "@/lib/format-money";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = { title: "paniAbi" };

// The public view for customers: read-only, no login. A minimal list for now;
// the full catalogue design is a separate card.
export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, priceCents: true },
  });

  return (
    <main className="min-h-screen px-4 pb-16 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <header className="border-line border-b py-8">
          <h1 className="font-display text-ink text-3xl sm:text-4xl">
            paniAbi
          </h1>
        </header>

        {products.length === 0 ? (
          <p className="text-quiet py-10">
            Todavía no hay productos para mostrar.
          </p>
        ) : (
          <ul aria-label="Productos" className="divide-line-row divide-y">
            {products.map((product) => (
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
        )}
      </div>
    </main>
  );
}
