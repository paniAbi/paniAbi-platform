import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Ingresá un nombre de categoría.")
    .max(50, "El nombre no puede tener más de 50 caracteres. Achicalo."),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export function normalizeCategoryName(name: string) {
  return name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("es-AR");
}
