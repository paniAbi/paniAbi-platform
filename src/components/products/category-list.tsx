"use client";

import { Button } from "@/components/ui/button";

export type CategoryListItem = {
  id: string;
  name: string;
};

type CategoryListProps = {
  categories: CategoryListItem[];
  selectedCategoryId: string | null;
  onSelect: (categoryId: string | null) => void;
};

export function CategoryList({
  categories,
  selectedCategoryId,
  onSelect,
}: CategoryListProps) {
  return (
    <ul aria-label="Categorías" className="space-y-1">
      {categories.map((category) => (
        <li key={category.id}>
          <Button
            type="button"
            variant={selectedCategoryId === category.id ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onSelect(category.id)}
          >
            {category.name}
          </Button>
        </li>
      ))}
      <li>
        <Button
          type="button"
          variant={selectedCategoryId === null ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => onSelect(null)}
        >
          Sin categoría
        </Button>
      </li>
    </ul>
  );
}
