import { z } from "zod";

export const signUpSchema = z.object({
    name: z.string()
        .min(1, "O nome é obrigatório.")
        .max(60, "O nome deve ter no máximo 60 caracteres."),
    email: z.string()
        .min(1, "O email é obrigatório.")
        .max(100, "O email deve ter no máximo 100 caracteres."),
    password: z.string()
        .min(1, "A senha é obrigatória.")
        .min(8, "A senha deve ter no mínimo 8 caracteres.")
        .max(50, "A senha deve ter no máximo 50 caracteres."),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;