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
        <header className="flex h-16 items-center justify-between border-b border-[#dfe3dc]">
          <a
            href="/products"
            className="flex items-center gap-2.5 text-[#263a31]"
          >
            <span className="flex size-8 items-center justify-center rounded-md bg-[#31594a] text-white">
              <Package2 aria-hidden="true" size={17} />
            </span>
            <span className="font-serif text-lg">paniAbi</span>
            <span className="ml-1 hidden border-l border-[#d8ddd5] pl-3 text-xs text-[#778078] sm:block">
              Bakery workspace
            </span>
          </a>
          <span className="text-xs font-medium tracking-[0.12em] text-[#7c847d] uppercase">
            Inventory
          </span>
        </header>

        <ProductWorkspace
          categories={categories}
          uncategorizedProducts={uncategorizedProducts}
        />
        <footer className="border-t border-[#dfe3dc] py-5 text-xs text-[#929991]">
          paniAbi platform <span className="px-1.5 text-[#c1c7bf]">/</span>{" "}
          Product catalogue
        </footer>
      </div>
    </main>
  );
}
