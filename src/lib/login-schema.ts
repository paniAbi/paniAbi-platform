import { z } from "zod";

export const loginFormSchema = z.object({
  username: z.string().trim().min(1, "Escribí tu usuario."),
  password: z.string().min(1, "Escribí tu contraseña."),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
