import { Package2 } from "lucide-react";
import { ProductWorkspace } from "@/components/products/product-workspace";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const [categories, uncategorizedProducts] = await Promise.all([
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        products: {
          where: { isActive: true },
          orderBy: { name: "asc" },
          select: { id: true, name: true, priceCents: true },
        },
      },
    }),
    prisma.product.findMany({
      where: { isActive: true, categoryId: null },
      orderBy: { name: "asc" },
      select: { id: true, name: true, priceCents: true },
    }),
  ]);

  return (
    <main className="min-h-screen px-4 pb-16 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="border-line flex h-16 items-center justify-between border-b">
          <a href="/products" className="text-ink flex items-center gap-2.5">
            <span className="bg-brand flex size-8 items-center justify-center rounded-md text-white">
              <Package2 aria-hidden="true" size={17} />
            </span>
            <span className="font-display text-lg">paniAbi</span>
            <span className="border-line-divider text-tagline ml-1 hidden border-l pl-3 text-xs sm:block">
              Bakery workspace
            </span>
          </a>
          <span className="text-label text-xs font-medium tracking-[0.12em] uppercase">
            Inventory
          </span>
        </header>

        <ProductWorkspace
          categories={categories}
          uncategorizedProducts={uncategorizedProducts}
        />
        <footer className="border-line text-faint border-t py-5 text-xs">
          paniAbi platform <span className="text-fainter px-1.5">/</span>{" "}
          Product catalogue
        </footer>
      </div>
    </main>
  );
}
