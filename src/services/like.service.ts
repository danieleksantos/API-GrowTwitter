import { prismaClient } from '../database/prismaClient.js';

export class LikeService {
    
    async create(userId: string, tweetId: string) {
        const targetTweet = await prismaClient.tweet.findUnique({ 
            where: { id: tweetId } 
        });

        if (!targetTweet) {
            throw new Error('TWEET_NOT_FOUND');
        }

        const existingLike = await prismaClient.like.findUnique({
            where: {
                userId_tweetId: { userId, tweetId },
            },
        });

        if (existingLike) {
            throw new Error('ALREADY_LIKED');
        }

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
            if (error.code === 'P2025') {
                throw new Error('LIKE_NOT_FOUND');
            }
            throw error;
        }
    }
}