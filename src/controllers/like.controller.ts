import { Request, Response } from 'express'
import { prismaClient } from '../database/prismaClient.js'


export async function likeTweet(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id 
    const { tweetId } = req.params 

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuário não autenticado.' })
    }

    try {
        const targetTweet = await prismaClient.tweet.findUnique({ where: { id: tweetId } })

        if (!targetTweet) {
            return res.status(404).json({ success: false, message: 'Tweet não encontrado.' })
        }

        const existingLike = await prismaClient.like.findUnique({
            where: {
                userId_tweetId: {
                    userId,
                    tweetId,
                },
            },
        })

        if (existingLike) {
            return res.status(409).json({ 
                success: false,
                message: 'Você já curtiu este tweet.',
            })
        }

        const newLike = await prismaClient.like.create({
            data: {
                userId,
                tweetId,
            },
        })

        return res.status(201).json({
            success: true,
            message: 'Tweet curtido com sucesso!',
            data: newLike,
        })
    } catch (error) {
        console.error('Erro ao curtir tweet:', error)
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao curtir tweet.',
        })
    }
}


export async function unlikeTweet(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id 
    const { tweetId } = req.params 

    if (!userId) {
        return res.status(401).json({ success: false, message: 'Usuário não autenticado.' })
    }

    try {
        const deletedLike = await prismaClient.like.delete({
            where: {
                userId_tweetId: {
                    userId,
                    tweetId,
                },
            },
        })

        return res.status(200).json({
            success: true,
            message: 'Curtida removida com sucesso.',
            data: deletedLike,
        })
    } catch (error) {
        if (error instanceof Error && 'code' in error && error.code === 'P2025') {
             return res.status(404).json({
                success: false,
                message: 'Curtida não encontrada. Você não curtiu este tweet.',
            })
        }
        
        console.error('Erro ao descurtir tweet:', error)
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao descurtir tweet.',
        })
    }
}