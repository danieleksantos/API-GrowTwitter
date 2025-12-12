import { Request, Response } from 'express';
import { LikeService } from '../services/like.service.js';

const likeService = new LikeService();

export async function likeTweet(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id;
    const { tweetId } = req.params;

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuário não autenticado.' });
    }

    if (!tweetId) {
        return res.status(400).json({ success: false, message: 'ID do tweet é obrigatório.' });
    }

    try {
        const newLike = await likeService.create(userId, tweetId);

        return res.status(201).json({
            success: true,
            message: 'Tweet curtido com sucesso!',
            data: newLike,
        });

    } catch (error: any) {
        if (error.message === 'TWEET_NOT_FOUND') {
            return res.status(404).json({ success: false, message: 'Tweet não encontrado.' });
        }
        
        if (error.message === 'ALREADY_LIKED') {
            return res.status(409).json({ 
                success: false, 
                message: 'Você já curtiu este tweet.' 
            });
        }

        console.error('Erro ao curtir tweet:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao curtir tweet.',
        });
    }
}


export async function unlikeTweet(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id;
    const { tweetId } = req.params;

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuário não autenticado.' });
    }

    if (!tweetId) {
        return res.status(400).json({ success: false, message: 'ID do tweet é obrigatório.' });
    }

    try {
        const deletedLike = await likeService.delete(userId, tweetId);

        return res.status(200).json({
            success: true,
            message: 'Curtida removida com sucesso.',
            data: deletedLike,
        });

    } catch (error: any) {
        if (error.message === 'LIKE_NOT_FOUND') {
            return res.status(404).json({
                success: false,
                message: 'Curtida não encontrada. Você não curtiu este tweet.',
            });
        }
        
        console.error('Erro ao descurtir tweet:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao descurtir tweet.',
        });
    }
}