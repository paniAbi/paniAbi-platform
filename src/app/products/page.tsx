import { Package2, Plus } from "lucide-react";
import { ProductForm } from "@/components/products/product-form";
import { ProductList } from "@/components/products/product-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, priceCents: true },
  });

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

        <section className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14 lg:py-14">
          <div>
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-[#dfe3dc] pb-5">
              <div>
                <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-[#b65f48] uppercase">
                  The daily shelf
                </p>
                <h1 className="font-serif text-3xl text-[#263a31] sm:text-4xl">
                  Products
                </h1>
              </div>
              <p className="text-sm text-[#788178]">
                {products.length} {products.length === 1 ? "item" : "items"}
              </p>
            </div>
            <ProductList products={products} />
          </div>

          <aside className="lg:pt-[3.25rem]">
            <Card className="border-[#dfe3dc] bg-white/80 shadow-[0_8px_32px_-24px_rgba(38,58,49,0.3)]">
              <CardHeader className="border-b border-[#edf0ea] px-5 pb-4">
                <div className="flex items-center gap-2 text-[#b65f48]">
                  <Plus aria-hidden="true" size={16} />
                  <span className="text-xs font-semibold tracking-[0.14em] uppercase">
                    New listing
                  </span>
                </div>
                <CardTitle className="font-serif text-xl text-[#263a31]">
                  Add a product
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pt-5">
                <ProductForm />
              </CardContent>
            </Card>
          </aside>
        </section>
        <footer className="border-t border-[#dfe3dc] py-5 text-xs text-[#929991]">
          paniAbi platform <span className="px-1.5 text-[#c1c7bf]">/</span>{" "}
          Product catalogue
        </footer>
      </div>
    </main>
  );
}
