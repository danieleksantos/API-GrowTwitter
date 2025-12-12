import { z } from 'zod';

export const createCommentSchema = z.object({
    content: z.string()
        .trim()
        .min(1, "O conteúdo do comentário não pode ser vazio.")
        .max(280, "O comentário não pode ter mais de 280 caracteres.")
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;