type NamedCategory = {
  name: string;
};

export function sortCategoriesByName<T extends NamedCategory>(categories: T[]) {
  return [...categories].sort((first, second) =>
    first.name.localeCompare(second.name, "es", { sensitivity: "base" }),
  );
}
