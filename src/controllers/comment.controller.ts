import { Request, Response } from 'express';
import { CommentService } from '../services/comment.service.js';
import { createCommentSchema } from '../dtos/comment.dto.js';

const commentService = new CommentService();

export async function createComment(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id;
    const { tweetId } = req.params;

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuário não autenticado.' });
    }

    if (!tweetId) {
        return res.status(400).json({ success: false, message: 'ID do tweet inválido.' });
    }

    const validation = createCommentSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ 
            success: false, 
            message: validation.error.issues[0].message 
        });
    }

    try {
        const newComment = await commentService.create({
            userId,
            tweetId,
            content: validation.data.content
        });

        return res.status(201).json({
            success: true,
            message: 'Comentário criado com sucesso!',
            data: newComment,
        });

    } catch (error: any) {
        if (error.message === 'TWEET_NOT_FOUND') {
            return res.status(404).json({ success: false, message: 'Tweet pai não encontrado.' });
        }

        console.error('Erro ao criar comentário:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao criar comentário.',
        });
    }
}


export async function listComments(req: Request, res: Response): Promise<Response> {
    const { tweetId } = req.params;

    if (!tweetId) {
        return res.status(400).json({ success: false, message: 'ID do tweet é obrigatório.' });
    }

    try {
        const comments = await commentService.list(tweetId);

        return res.status(200).json({
            success: true,
            data: comments,
        });

    } catch (error) {
        console.error('Erro ao listar comentários:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao listar comentários.',
        });
    }
}