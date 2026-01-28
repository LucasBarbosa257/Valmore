import { z } from "zod";

export const chatSchema = z.object({
    message: z.string()
        .min(1, "A mensagem é obrigatória.")
        .max(300, "A mensagem deve ter no máximo 300 caracteres.")
});

export type ChatSchema = z.infer<typeof chatSchema>;