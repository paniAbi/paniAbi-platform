export type CategoryListItem = {
  id: string;
  name: string;
};

type CategoryListProps = {
  categories: CategoryListItem[];
};

export function CategoryList({ categories }: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <p className="text-sm text-[#788178]">
        Todavía no hay categorías creadas.
      </p>
    );
  }

  return (
    <ul aria-label="Categorías" className="space-y-1">
      {categories.map((category) => (
        <li
          key={category.id}
          className="rounded-md bg-[#edf2ee] px-3 py-2 text-sm font-medium text-[#31594a]"
        >
          {category.name}
        </li>
      ))}
    </ul>
  );
}
