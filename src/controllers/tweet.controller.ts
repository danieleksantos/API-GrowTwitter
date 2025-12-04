
import { Request, Response } from 'express'
import { prismaClient } from '../database/prismaClient.js'


export async function createTweet(req: Request, res: Response): Promise<Response> {
    const { content } = req.body
    const userId = req.user?.id 

    if (!content || content.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: 'O conteúdo do tweet não pode ser vazio.',
        })
    }
    
    if (!userId) {
        return res.status(401).json({
            success: false,
            message: 'ID do usuário não encontrado. Faça login novamente.',
        })
    }

    if (content.length > 280) {
        return res.status(400).json({
            success: false,
            message: 'O tweet não pode ter mais de 280 caracteres.',
        })
    }

    try {
        const newTweet = await prismaClient.tweet.create({
            data: {
                content,
                userId,
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
                _count: { 
                    select: { 
                        likes: true, 
                        comments: true 
                    } 
                }
            },
        })

        return res.status(201).json({
            success: true,
            message: 'Tweet criado com sucesso!',
            data: newTweet,
        })
    } catch (error) {
        console.error('Erro ao criar tweet:', error)
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao criar o tweet.',
        })
    }
}


export async function getFeed(req: Request, res: Response): Promise<Response> {
    const currentUserId = req.user?.id 

    if (!currentUserId) {
        return res.status(401).json({ message: "Usuário não autenticado." })
    }

    try {
        const followingRelations = await prismaClient.follows.findMany({
            where: {
                followerId: currentUserId,
            },
            select: {
                followingId: true,
            },
        })

        const followedUserIds = followingRelations.map(f => f.followingId)
        const userIdsToInclude = [currentUserId, ...followedUserIds] 

        const tweets = await prismaClient.tweet.findMany({
            where: {
                userId: {
                    in: userIdsToInclude, 
                },
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
                _count: { 
                    select: { 
                        likes: true,
                        comments: true 
                    } 
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return res.status(200).json({
            success: true,
            data: tweets,
        })
    } catch (error) {
        console.error('Erro ao buscar o feed de tweets personalizado:', error)
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao carregar o feed.',
        })
    }
}


export async function deleteTweet(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id 
    const { tweetId } = req.params 

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuário não autenticado.' })
    }

    try {
        const tweet = await prismaClient.tweet.findUnique({
            where: { id: tweetId },
            select: { userId: true, id: true }
        })

        if (!tweet) {
            return res.status(404).json({ success: false, message: 'Tweet não encontrado.' })
        }

        if (tweet.userId !== userId) {
            return res.status(403).json({ success: false, message: 'Você só pode deletar seus próprios tweets.' })
        }
        
        await prismaClient.tweet.delete({
            where: { id: tweetId },
        })

        return res.status(200).json({
            success: true,
            message: 'Tweet deletado com sucesso.',
            data: { id: tweetId },
        })

    } catch (error) {
        console.error('Erro ao deletar tweet:', error)
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao deletar tweet.',
        })
    }
}