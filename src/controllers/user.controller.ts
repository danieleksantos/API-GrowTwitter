import { Request, Response } from 'express';
import { UserService } from '../services/user.service.js';
import { updateUserSchema, listUsersSchema } from '../dtos/user.dto.js';

const userService = new UserService();

export async function getUserProfile(req: Request, res: Response): Promise<Response> {
    const { username } = req.params;
    const currentUserId = req.user?.id;

    try {
        const profile = await userService.getProfile(username, currentUserId);
        return res.status(200).json({ success: true, data: profile });

    } catch (error: any) {
        if (error.message === 'USER_NOT_FOUND') {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
        }
        console.error('Erro ao buscar perfil:', error);
        return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
}

export async function followUser(req: Request, res: Response): Promise<Response> {
    const followerId = req.user?.id;
    const { followingId } = req.params;

    if (!followerId) return res.status(401).json({ success: false, message: 'Usuário não autenticado.' });
    if (!followingId) return res.status(400).json({ success: false, message: 'ID alvo inválido.' });

    try {
        const follow = await userService.follow(followerId, followingId);
        return res.status(201).json({ success: true, message: 'Usuário seguido com sucesso.', data: follow });

    } catch (error: any) {
        if (error.message === 'SELF_FOLLOW') {
            return res.status(400).json({ success: false, message: 'Você não pode seguir a si mesmo.' });
        }
        if (error.message === 'USER_NOT_FOUND') {
            return res.status(404).json({ success: false, message: 'Usuário alvo não encontrado.' });
        }
        if (error.message === 'ALREADY_FOLLOWING') {
            return res.status(409).json({ success: false, message: 'Você já segue este usuário.' });
        }
        
        console.error('Erro ao seguir:', error);
        return res.status(500).json({ success: false, message: 'Erro interno.' });
    }
}

export async function unfollowUser(req: Request, res: Response): Promise<Response> {
    const followerId = req.user?.id;
    const { followingId } = req.params;

    if (!followerId) return res.status(401).json({ success: false, message: 'Usuário não autenticado.' });
    if (!followingId) return res.status(400).json({ success: false, message: 'ID alvo inválido.' });

    try {
        await userService.unfollow(followerId, followingId);
        return res.status(200).json({ success: true, message: 'Você deixou de seguir o usuário.' });

    } catch (error: any) {
        if (error.message === 'NOT_FOLLOWING') {
            return res.status(404).json({ success: false, message: 'Você não segue este usuário.' });
        }
        console.error('Erro ao deixar de seguir:', error);
        return res.status(500).json({ success: false, message: 'Erro interno.' });
    }
}

export async function listUsers(req: Request, res: Response): Promise<Response> {
    const currentUserId = req.user?.id;
    
    const validation = listUsersSchema.safeParse(req.query);
    if (!validation.success) {
        return res.status(400).json({ success: false, message: 'Paginação inválida.' });
    }

    const { page } = validation.data;

    try {
        const result = await userService.list(currentUserId, page);
        return res.status(200).json({ success: true, data: result.data, meta: result.meta });

    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        return res.status(500).json({ success: false, message: 'Erro interno.' });
    }
}

export async function updateUser(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Usuário não autenticado.' });

    const validation = updateUserSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ 
            success: false, 
            message: validation.error.issues[0].message 
        });
    }

    try {
        const updatedUser = await userService.update({ 
            userId, 
            ...validation.data 
        });
        
        return res.status(200).json({ 
            success: true, 
            message: 'Perfil atualizado com sucesso!', 
            data: updatedUser 
        });

    } catch (error: any) {
        if (error.message === 'USER_NOT_FOUND') {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
        }
        console.error('Erro ao atualizar usuário:', error);
        return res.status(500).json({ success: false, message: 'Erro interno.' });
    }
}