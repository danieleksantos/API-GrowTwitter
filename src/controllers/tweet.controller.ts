import { Request, Response } from 'express';
import { TweetService } from '../services/tweet.service.js';
import { createTweetSchema, listTweetsSchema } from '../dtos/tweet.dto.js';

const tweetService = new TweetService();

export async function createTweet(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'ID do usuário não encontrado.' });

    const validation = createTweetSchema.safeParse(req.body);
    
    if (!validation.success) {
        return res.status(400).json({ 
            success: false, 
            message: validation.error.issues[0].message 
        });
    }

    try {
        const data = await tweetService.create({ 
            userId, 
            content: validation.data.content 
        });

        return res.status(201).json({
            success: true,
            message: 'Tweet criado com sucesso!',
            data,
        });

    } catch (error) {
        console.error('Erro ao criar tweet:', error);
        return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
}

export async function listTweets(req: Request, res: Response): Promise<Response> {
    const currentUserId = req.user?.id;
    
    const validation = listTweetsSchema.safeParse(req.query);
    if (!validation.success) {
         return res.status(400).json({ success: false, message: 'Parâmetros inválidos.' });
    }

    const { username, type, page } = validation.data;

    try {
        const result = await tweetService.list({ 
            currentUserId, 
            username, 
            type, 
            page 
        });

        return res.status(200).json({
            success: true,
            data: result.data,
            meta: result.meta
        });

    } catch (error: any) {
        if (error.message === 'USER_NOT_FOUND') {
            return res.status(404).json({ success: false, message: "Usuário não encontrado." });
        }
        if (error.message === 'UNAUTHORIZED') {
            return res.status(401).json({ success: false, message: "Login necessário para ver o feed." });
        }

        console.error('Erro ao buscar tweets:', error);
        return res.status(500).json({ success: false, message: 'Erro ao carregar tweets.' });
    }
}

export async function deleteTweet(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id;
    const { tweetId } = req.params;

    if (!userId) return res.status(401).json({ success: false, message: 'Usuário não autenticado.' });

    try {
        await tweetService.delete(tweetId, userId);
        return res.status(200).json({ success: true, message: 'Tweet deletado.' });

    } catch (error: any) {
        if (error.message === 'TWEET_NOT_FOUND') {
            return res.status(404).json({ success: false, message: 'Tweet não encontrado.' });
        }
        if (error.message === 'FORBIDDEN_DELETE') {
            return res.status(403).json({ success: false, message: 'Proibido deletar tweet de outro usuário.' });
        }

        console.error('Erro ao deletar tweet:', error);
        return res.status(500).json({ success: false, message: 'Erro interno.' });
    }
}