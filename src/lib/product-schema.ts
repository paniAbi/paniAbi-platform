import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().trim().min(1, "Escribí el nombre del producto."),
  pricePesos: z
    // An empty number field arrives as NaN, which is not a number to Zod.
    .number({ error: "Escribí el precio del producto." })
    .min(0.01, "El precio tiene que ser de al menos un centavo."),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
