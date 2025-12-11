import { Request, Response } from 'express'
import { prismaClient } from '../database/prismaClient.js'

// CREATE TWEET
export async function createTweet(req: Request, res: Response): Promise<Response> {
    const { content } = req.body
    const userId = req.user?.id 

    if (!content || content.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'O conteúdo do tweet não pode ser vazio.' })
    }
    
    if (!userId) {
        return res.status(401).json({ success: false, message: 'ID do usuário não encontrado.' })
    }

    if (content.length > 280) {
        return res.status(400).json({ success: false, message: 'O tweet não pode ter mais de 280 caracteres.' })
    }

    try {
        const newTweet = await prismaClient.tweet.create({
            data: { content, userId },
            include: {
                user: {
                    select: { id: true, username: true, name: true, imageUrl: true },
                },
                _count: { 
                    select: { likes: true, comments: true } 
                }
            },
        })

        return res.status(201).json({
            success: true,
            message: 'Tweet criado com sucesso!',
            data: { 
                ...newTweet, 
                likesCount: newTweet._count.likes,
                repliesCount: newTweet._count.comments,
                isLikedByMe: false,
            },
        })
    } catch (error) {
        console.error('Erro ao criar tweet:', error)
        return res.status(500).json({ success: false, message: 'Erro interno do servidor.' })
    }
}

// --- LIST TWEETS 
export async function listTweets(req: Request, res: Response): Promise<Response> {
    const currentUserId = req.user?.id 
    
    const { username, type, page } = req.query as { username?: string, type?: string, page?: string };

    const pageNumber = Number(page) || 1;
    const take = 10;
    const skip = (pageNumber - 1) * take;

    try {
        let whereCondition: any = {}; 

        if (username) {
            const targetUser = await prismaClient.user.findUnique({
                where: { username },
                select: { id: true },
            });

            if (!targetUser) {
                return res.status(404).json({ success: false, message: "Usuário não encontrado." });
            }
            whereCondition = { userId: targetUser.id };
        } 
        
        else if (type === 'global') {
            whereCondition = {}; 
        } 
        
        else {
            if (!currentUserId) {
                return res.status(401).json({ message: "Login necessário para ver o feed." })
            }

            const followingRelations = await prismaClient.follows.findMany({
                where: { followerId: currentUserId },
                select: { followingId: true },
            })
            
            const followedUserIds = followingRelations.map(f => f.followingId)
            const userIdsToInclude = [currentUserId, ...followedUserIds] 

            whereCondition = { userId: { in: userIdsToInclude } };
        }

        const tweets = await prismaClient.tweet.findMany({
            take,
            skip,
            where: whereCondition,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { id: true, username: true, name: true, imageUrl: true },
                },
                likes: { 
                    where: currentUserId ? { userId: currentUserId } : undefined,
                    select: { userId: true } 
                },
                _count: { 
                    select: { likes: true, comments: true } 
                }
            },
        })

        const formattedTweets = tweets.map((tweet: any) => { 
            const isLikedByMe = tweet.likes.length > 0;
            const { likes, _count, ...rest } = tweet;

            return {
                ...rest,
                isLikedByMe,
                likesCount: _count.likes,
                repliesCount: _count.comments,
            }
        })

        return res.status(200).json({
            success: true,
            data: formattedTweets,
            meta: {
                page: pageNumber,
                limit: take,
            }
        })

    } catch (error) {
        console.error('Erro ao buscar tweets:', error)
        return res.status(500).json({ success: false, message: 'Erro ao carregar tweets.' })
    }
}

// --- DELETE TWEET
export async function deleteTweet(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id 
    const { tweetId } = req.params 

    if (!userId) return res.status(401).json({ success: false, message: 'Usuário não autenticado.' })

    try {
        const tweet = await prismaClient.tweet.findUnique({
            where: { id: tweetId },
            select: { userId: true }
        })

        if (!tweet) return res.status(404).json({ success: false, message: 'Tweet não encontrado.' })

        if (tweet.userId !== userId) {
            return res.status(403).json({ success: false, message: 'Proibido deletar tweet de outro usuário.' })
        }
        
        await prismaClient.tweet.delete({ where: { id: tweetId } })

        return res.status(200).json({ success: true, message: 'Tweet deletado.' })

    } catch (error) {
        console.error('Erro ao deletar tweet:', error)
        return res.status(500).json({ success: false, message: 'Erro interno.' })
    }
}