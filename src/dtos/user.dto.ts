import { z } from 'zod';

export const updateUserSchema = z.object({
    name: z.string().min(1, "O nome não pode ser vazio.").optional(),
    imageUrl: z.string().url("URL da imagem inválida").optional(),
});

export const listUsersSchema = z.object({
    page: z.coerce.number().min(1, "Página inválida").default(1),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;