import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { registerUserSchema, loginUserSchema } from '../dtos/auth.dto.js';

const authService = new AuthService();

export async function registerUser(req: Request, res: Response): Promise<Response> {
    const validation = registerUserSchema.safeParse(req.body);
    
    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: validation.error.issues[0].message, 
        });
    }

    try {
        const newUser = await authService.register(validation.data);

        return res.status(201).json({
            success: true,
            message: 'Registro concluído com sucesso.',
            data: newUser,
        });

    } catch (error: any) {
        if (error.message === 'USER_ALREADY_EXISTS') {
            return res.status(409).json({
                success: false,
                message: 'O nome de usuário já está em uso. Por favor, escolha outro.',
            });
        }
        
        console.error('Erro no registro de usuário:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao tentar registrar o usuário.',
        });
    }
}

export async function loginUser(req: Request, res: Response): Promise<Response> {
    const validation = loginUserSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: validation.error.issues[0].message,
        });
    }

    try {
        const result = await authService.login(validation.data);

        return res.status(200).json({
            success: true,
            message: 'Login bem-sucedido.',
            token: result.token,
            user: result.user,
        });

    } catch (error: any) {
        if (error.message === 'INVALID_CREDENTIALS') {
            return res.status(401).json({
                success: false,
                message: 'Credenciais inválidas.',
            });
        }
        
        if (error.message === 'SERVER_CONFIG_ERROR') {
            console.error("JWT_SECRET não configurado em .env");
            return res.status(500).json({ message: "Erro de configuração do servidor." });
        }

        console.error('Erro no login de usuário:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao tentar fazer login.',
        });
    }
}