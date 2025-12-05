import { Request, Response } from 'express'
import { prismaClient } from '../database/prismaClient.js'


export async function createComment(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id 
    const { tweetId } = req.params 
    const { content } = req.body

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuário não autenticado.' })
    }
    
    if (!content || content.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'O conteúdo do comentário não pode ser vazio.' })
    }

    try {
        const targetTweet = await prismaClient.tweet.findUnique({ where: { id: tweetId } })

        if (!targetTweet) {
            return res.status(404).json({ success: false, message: 'Tweet pai não encontrado.' })
        }

        const newComment = await prismaClient.comment.create({
            data: {
                userId,
                tweetId,
                content,
            },
            include: {
                user: { 
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        imageUrl: true,
                    },
                },
            },
        })

        return res.status(201).json({
            success: true,
            message: 'Comentário criado com sucesso!',
            data: newComment,
        })
    } catch (error) {
        console.error('Erro ao criar comentário:', error)
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao criar comentário.',
        })
    }
}


export async function listComments(req: Request, res: Response): Promise<Response> {
    const { tweetId } = req.params 

    try {
        const comments = await prismaClient.comment.findMany({
            where: { tweetId },
            orderBy: { createdAt: 'asc' }, 
            include: {
                user: { 
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        imageUrl: true,
                    },
                },
            },
        })

        return res.status(200).json({
            success: true,
            data: comments,
        })
    } catch (error) {
        console.error('Erro ao listar comentários:', error)
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao listar comentários.',
        })
    }
}