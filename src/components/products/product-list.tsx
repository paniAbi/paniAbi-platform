import { PackageOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatPesos } from "@/lib/format-money";

export type ProductListItem = {
  id: string;
  name: string;
  priceCents: number;
};

type ProductListProps = {
  products: ProductListItem[];
};

export function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return (
      <Card className="border-dashed bg-white/70 shadow-none">
        <CardContent className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
          <span className="bg-mist text-brand mb-4 flex size-12 items-center justify-center rounded-full">
            <PackageOpen aria-hidden="true" size={21} />
          </span>
          <h2 className="font-display text-ink text-xl">
            Todavía no hay productos
          </h2>
          <p className="text-quiet mt-2 max-w-sm text-sm leading-6">
            Agregá el primer producto con el formulario. Va a aparecer acá para
            todo el equipo.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ul aria-label="Productos" className="divide-line-row divide-y">
      {products.map((product) => (
        <li key={product.id}>
          <Card className="border-line-row rounded-none border-0 border-b bg-transparent py-0 shadow-none last:border-b-0">
            <CardContent className="flex min-h-20 items-center justify-between gap-4 px-3 py-4 sm:px-5">
              <div className="min-w-0">
                <h2 className="text-ink truncate font-medium">
                  {product.name}
                </h2>
              </div>
              <p className="text-ink shrink-0 font-medium tabular-nums">
                {formatPesos(product.priceCents)}
              </p>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
