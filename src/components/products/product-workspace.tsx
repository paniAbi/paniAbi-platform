"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { CategoryForm } from "@/components/products/category-form";
import {
  CategoryList,
  type CategoryListItem,
} from "@/components/products/category-list";
import { ProductForm } from "@/components/products/product-form";
import {
  ProductList,
  type ProductListItem,
} from "@/components/products/product-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CategoryWithProducts = CategoryListItem & {
  products: ProductListItem[];
};

type ProductWorkspaceProps = {
  categories: CategoryWithProducts[];
  uncategorizedProducts: ProductListItem[];
};

export function ProductWorkspace({
  categories,
  uncategorizedProducts,
}: ProductWorkspaceProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId,
  );
  const categoryName = selectedCategory?.name ?? "Sin categoría";
  const products = selectedCategory?.products ?? uncategorizedProducts;

  function selectCategory(categoryId: string | null) {
    setSelectedCategoryId(categoryId);
    setIsAddingProduct(false);
  }

  return (
    <section className="grid gap-10 py-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14 lg:py-14">
      <aside>
        <Card className="border-[#dfe3dc] bg-white/80 shadow-[0_8px_32px_-24px_rgba(38,58,49,0.3)]">
          <CardHeader className="border-b border-[#edf0ea] px-5 pb-4">
            <CardTitle className="font-serif text-xl text-[#263a31]">
              Categorías
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 px-5 pt-5">
            <CategoryList
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelect={selectCategory}
            />
            <CategoryForm />
          </CardContent>
        </Card>
      </aside>

      <div>
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-[#dfe3dc] pb-5">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-[#b65f48] uppercase">
              Productos
            </p>
            <h1 className="font-serif text-3xl text-[#263a31] sm:text-4xl">
              {categoryName}
            </h1>
          </div>
          <Button
            type="button"
            className="h-10 rounded-md bg-[#31594a] text-white hover:bg-[#26483a]"
            onClick={() => setIsAddingProduct((isAdding) => !isAdding)}
          >
            <Plus aria-hidden="true" />
            Agregar producto
          </Button>
        </div>

        {isAddingProduct && (
          <Card className="mb-6 border-[#dfe3dc] bg-white/80 shadow-[0_8px_32px_-24px_rgba(38,58,49,0.3)]">
            <CardHeader className="border-b border-[#edf0ea] px-5 pb-4">
              <CardTitle className="font-serif text-xl text-[#263a31]">
                Agregar producto a {categoryName}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pt-5">
              <ProductForm
                categoryId={selectedCategoryId}
                categoryName={categoryName}
              />
            </CardContent>
          </Card>
        )}

        <ProductList products={products} />
      </div>
    </section>
  );
}
