import { z } from 'zod';

export const registerUserSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório."),
    username: z.string().min(1, "O username é obrigatório."),
    password: z.string().min(4, "A senha deve ter no mínimo 4 caracteres."),
    imageUrl: z.string().url("URL da imagem inválida").optional(),
});

export const loginUserSchema = z.object({
    username: z.string().min(1, "Username é obrigatório."),
    password: z.string().min(1, "Password é obrigatório."),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;