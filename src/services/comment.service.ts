import { prismaClient } from '../database/prismaClient.js';

interface CreateCommentParams {
    userId: string;
    tweetId: string;
    content: string;
}

export class CommentService {
    
    async create({ userId, tweetId, content }: CreateCommentParams) {
        const targetTweet = await prismaClient.tweet.findUnique({ 
            where: { id: tweetId } 
        });

        if (!targetTweet) {
            throw new Error('TWEET_NOT_FOUND');
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
        });

        return newComment;
    }

    async list(tweetId: string) {
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
        });

        return comments;
    }
}