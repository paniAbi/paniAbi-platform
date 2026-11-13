"use client";

import { useState } from "react";
import { changeProductCategory } from "@/app/products/product-category-actions";
import type { CategoryListItem } from "@/components/products/category-list";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type ProductCategoryChangeProps = {
  productId: string;
  currentCategoryId: string | null;
  categories: CategoryListItem[];
};

export function ProductCategoryChange({
  productId,
  currentCategoryId,
  categories,
}: ProductCategoryChangeProps) {
  const [categoryId, setCategoryId] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const availableCategories = categories.filter(
    (category) => category.id !== currentCategoryId,
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!categoryId) {
      return;
    }

    setIsSaving(true);
    setMessage("");
    const result = await changeProductCategory({
      productId,
      categoryId: categoryId === "uncategorized" ? null : categoryId,
    });
    setIsSaving(false);

    if (result.success) {
      setCategoryId("");
      setMessage("Categoría actualizada.");
      return;
    }

    setMessage(result.message);
  }

  return (
    <form className="mt-3 flex flex-wrap items-end gap-2" onSubmit={onSubmit}>
      <div className="grid gap-1">
        <Label htmlFor={`product-category-${productId}`} className="text-xs">
          Cambiar categoría a…
        </Label>
        <select
          id={`product-category-${productId}`}
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          className="h-8 rounded-lg border border-[#d8ddd5] bg-white px-2 text-sm text-[#263a31]"
        >
          <option value="" disabled>
            Elegí una categoría
          </option>
          {availableCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
          {currentCategoryId !== null && (
            <option value="uncategorized">Sin categoría</option>
          )}
        </select>
      </div>
      <Button type="submit" size="sm" disabled={!categoryId || isSaving}>
        Confirmar cambio
      </Button>
      <p aria-live="polite" className="text-sm text-[#52665a]">
        {message}
      </p>
    </form>
  );
}
