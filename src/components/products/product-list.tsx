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
          <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-[#edf2ee] text-[#31594a]">
            <PackageOpen aria-hidden="true" size={21} />
          </span>
          <h2 className="font-serif text-xl text-[#263a31]">
            Nothing on the shelf yet
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-[#727b74]">
            Add the first product using the form. It will appear here for the
            whole team.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ul aria-label="Products" className="divide-y divide-[#e7e8e1]">
      {products.map((product) => (
        <li key={product.id}>
          <Card className="rounded-none border-0 border-b border-[#e7e8e1] bg-transparent py-0 shadow-none last:border-b-0">
            <CardContent className="flex min-h-20 items-center justify-between gap-4 px-3 py-4 sm:px-5">
              <div className="min-w-0">
                <h2 className="truncate font-medium text-[#263a31]">
                  {product.name}
                </h2>
                <p className="mt-1 text-xs text-[#899089]">
                  Available for sale
                </p>
              </div>
              <p className="shrink-0 font-medium text-[#263a31] tabular-nums">
                {formatPesos(product.priceCents)}
              </p>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
