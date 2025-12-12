import { prismaClient } from '../database/prismaClient.js';

export class LikeService {
    
    async create(userId: string, tweetId: string) {
        // 1. Verificar se o tweet existe
        const targetTweet = await prismaClient.tweet.findUnique({ 
            where: { id: tweetId } 
        });

        if (!targetTweet) {
            throw new Error('TWEET_NOT_FOUND');
        }

        // 2. Verificar se já curtiu (Evitar duplicidade)
        const existingLike = await prismaClient.like.findUnique({
            where: {
                userId_tweetId: { userId, tweetId },
            },
        });

        if (existingLike) {
            throw new Error('ALREADY_LIKED');
        }

        // 3. Criar o like
        const newLike = await prismaClient.like.create({
            data: { userId, tweetId },
        });

        return newLike;
    }

    async delete(userId: string, tweetId: string) {
        try {
            const deletedLike = await prismaClient.like.delete({
                where: {
                    userId_tweetId: { userId, tweetId },
                },
            });
            return deletedLike;
        } catch (error: any) {
            // Prisma error code P2025: Record to delete does not exist.
            if (error.code === 'P2025') {
                throw new Error('LIKE_NOT_FOUND');
            }
            throw error;
        }
    }
}