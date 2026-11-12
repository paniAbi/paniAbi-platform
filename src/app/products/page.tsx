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
        <header className="border-line flex h-16 items-center justify-between border-b">
          <a href="/products" className="text-ink flex items-center gap-2.5">
            <span className="bg-brand flex size-8 items-center justify-center rounded-md text-white">
              <Package2 aria-hidden="true" size={17} />
            </span>
            <span className="font-display text-lg">paniAbi</span>
            <span className="border-line-divider text-tagline ml-1 hidden border-l pl-3 text-xs sm:block">
              Gestión de la panadería
            </span>
          </a>
          <span className="text-label text-xs font-medium tracking-[0.12em] uppercase">
            Inventario
          </span>
        </header>

        <section className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14 lg:py-14">
          <div>
            <div className="border-line mb-7 flex flex-wrap items-end justify-between gap-4 border-b pb-5">
              <div>
                <p className="text-highlight mb-2 text-xs font-semibold tracking-[0.16em] uppercase">
                  La vitrina del día
                </p>
                <h1 className="font-display text-ink text-3xl sm:text-4xl">
                  Productos
                </h1>
              </div>
              <p className="text-subtle text-sm">
                {products.length}{" "}
                {products.length === 1 ? "producto" : "productos"}
              </p>
            </div>
            <ProductList products={products} />
          </div>

          <aside className="lg:pt-[3.25rem]">
            <Card className="border-line shadow-card bg-white/80">
              <CardHeader className="border-line-soft border-b px-5 pb-4">
                <div className="text-highlight flex items-center gap-2">
                  <Plus aria-hidden="true" size={16} />
                  <span className="text-xs font-semibold tracking-[0.14em] uppercase">
                    New listing
                  </span>
                </div>
                <CardTitle className="font-display text-ink text-xl">
                  Agregar un producto
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pt-5">
                <ProductForm />
              </CardContent>
            </Card>
          </aside>
        </section>
        <footer className="border-line text-faint border-t py-5 text-xs">
          Plataforma paniAbi <span className="text-fainter px-1.5">/</span>{" "}
          Catálogo de productos
        </footer>
      </div>
    </main>
  );
}
