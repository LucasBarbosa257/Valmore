import { z } from "zod";

export const updateUserIntegrationSchema = z.object({
    host: z.string()
        .min(1, "O host é obrigatório.")
        .max(100, "O host deve ter no máximo 100 caracteres."),
    email: z.string()
        .min(1, "O email é obrigatório.")
        .max(100, "O email deve ter no máximo 100 caracteres."),
    api_token: z.string()
        .min(1, "O token de API é obrigatório.")
        .max(300, "O token de API deve ter no máximo 300 caracteres."),
});

export type UpdateUserIntegrationSchema = z.infer<typeof updateUserIntegrationSchema>;