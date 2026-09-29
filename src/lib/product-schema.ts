import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().trim().min(1, "Enter a product name."),
  pricePesos: z.number().min(0.01, "Price must be at least one cent."),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
