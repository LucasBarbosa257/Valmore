import { z } from "zod";

export const signInSchema = z.object({
    email: z.string()
        .min(1, "O email é obrigatório.")
        .max(100, "O email deve ter no máximo 100 caracteres."),
    password: z.string()
        .min(1, "A senha é obrigatória.")
        .min(8, "A senha deve ter no mínimo 8 caracteres.")
        .max(50, "A senha deve ter no máximo 50 caracteres."),
});

export type SignInSchema = z.infer<typeof signInSchema>;