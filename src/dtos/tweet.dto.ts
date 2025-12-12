import { z } from 'zod';

export const createTweetSchema = z.object({
    content: z.string()
        .min(1, "O conteúdo do tweet não pode ser vazio.")
        .max(280, "O tweet não pode ter mais de 280 caracteres.")
});

export const listTweetsSchema = z.object({
    username: z.string().optional(),
    type: z.enum(['global', 'feed']).optional(),
    page: z.coerce.number().min(1, "Página inválida").default(1),
});

export type CreateTweetInput = z.infer<typeof createTweetSchema>;
export type ListTweetsInput = z.infer<typeof listTweetsSchema>;